
///<reference path="../object/gameobject.ts"/>
///<reference path="../state/gamestate.ts"/>
module pt.model {
    export class Event {//TODO implements IPromise, IThenable
        protected id: string;
        //callbacks
        protected onUpdate: (parent: pt.object.GameObject) => void;
        protected onCreate: (parent: pt.object.GameObject, args?) => void;
        protected onFire: (parent?: pt.object.GameObject, from?: pt.object.GameObject, arg?) => void;
        protected onDone: (self: pt.model.Event) => void;

        /**
         * strage is saved in userdata
         */
        protected storage: any;

        private hasDone: boolean;
        private currentParent: pt.object.GameObject;

        protected unfirableWithNoArg = false;
        protected pause = false;

        protected allowedTriggers: Array<any>;

        protected state: pt.state.GameState;

        get Id(): string {
            if (this.id == null) {
                this.id = pt.util.getRandomStr();
            }
            return this.id;
        }

        set Id(v) {
            this.id = v;
        }

        set Pause(v) {
            this.pause = v;
        }

        get Pause() {
            return this.pause;
        }

        get OnDone() {
            return this.onDone;
        }

        public setOnDone(v) {
            this.onDone = v;
            return this;
        }

        /**
         *
         * @param onFire when Event#fire is called
         * @param onCreate when this event is added to GameObject
         * @param onUpdate called every frame if this event is fired ,until Event#done is called
         */
        constructor(onFire?: (parent: pt.object.GameObject, from?: pt.object.GameObject, arg?) => void, onCreate?: (parent: pt.object.GameObject, args?) => void, onUpdate?: (parent: pt.object.GameObject) => void, storage = {}) {
            this.onFire = onFire;
            this.onCreate = onCreate;
            this.onUpdate = onUpdate;
            this.storage = storage;
            this.allowedTriggers = [];
        }

        /**
         * Event#done is called
         */
        get HasDone(): boolean {
            return this.hasDone;
        }

        public isAllowedTrigger(obj) {
            return this.allowedTriggers.length == 0 || (obj != null && this.allowedTriggers.indexOf(obj) >= 0);
        }

        public addAllowedTrigger(obj) {
            this.allowedTriggers.push(obj);
        }

        public removeAllowedTrigger(obj) {
            this.allowedTriggers.splice(this.allowedTriggers.indexOf(obj), 1);
        }

        public callOnCreate(parent: pt.object.GameObject, arg?) {
            this.state = <pt.state.GameState>parent.game.state.getCurrentState();

            if (this.onCreate != null) {
                this.onCreate(parent, arg);
            }
        }

        /**
         * fire event. this starts update loop until Event#done is called
         */
        public fire(parent: pt.object.GameObject, from?: pt.object.GameObject, arg?) {
            this.state = <pt.state.GameState>parent.game.state.getCurrentState();
            if (arg == null && this.unfirableWithNoArg && !this.isAllowedTrigger(from)) {
                return;
            }
            this.hasDone = false;

            if (parent && !parent.hasEvent(this)) {
                parent.addEvent(this);
            }

            if (this.onFire != null) {
                this.onFire(parent, from, arg);
            }
            return this;
        }

        private destroy() {
            this.hasDone = true;//done without onDone
            if (this.currentParent != null) {
                this.currentParent.removeEvent(this);
            }
            this.onDone = null;
        }

        public callOnUpdate(parent: pt.object.GameObject) {
            if (!this.hasDone && this.onUpdate != null && !this.Pause) {
                this.state = <pt.state.GameState>parent.game.state.getCurrentState();
                this.onUpdate(parent);
            }
        }

        /**
         * stops update loop and call onDone callback set in Event#fire
         */
        public done(destroy = false) {//TODO
            //this.state = <pt.state.GameState>parent.game.state.getCurrentState();
            this.hasDone = true;
            if (this.onDone != null) {
                this.onDone(this);
            }

            if (destroy) {
                this.destroy();
            }
        }

        public toJSON() {
            var ret = {
                onUpdate: this.onUpdate ? Event.funcToString(this.onUpdate) : null,
                onCreate: this.onCreate ? Event.funcToString(this.onCreate) : null,
                onFire: this.onFire ? Event.funcToString(this.onFire) : null,
                storage: this.storage
            };
            /**
            for (var prop in this) {
                var spFunc = Event.isExFuncProp(prop);
                if (spFunc && typeof this[prop] === "function") {
                    ret[prop] = Event.funcToString(this[prop]);
                }
            }
            **/

            return ret;
        }

        private static isExFuncProp(prop) {
            return ((prop + "").lastIndexOf("ex_") == 0)
        }

        private static funcToString(f) {
            return "(" + f + ")";
        }

        public static fromJSON(json): Event {
            var f = eval(json.onFire);
            var c = eval(json.onCreate);
            var u = eval(json.onUpdate);
            var ev = new Event(f, c, u, json.storage);
            /**
            for (var prop in json) {
                if (Event.isExFuncProp(prop)) {
                    ev[prop] = Event.funcToString(json[prop]);
                }
            }
            **/

            return ev;
        }
    }
}