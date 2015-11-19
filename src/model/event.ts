
///<reference path="../object/gameobject.ts"/>
module pt.model {
    export class Event {
        protected onUpdate: (parent: pt.object.GameObject) => void;
        protected onCreate: (parent: pt.object.GameObject, args?) => void;
        protected onFire: (from: pt.object.GameObject, parent?: pt.object.GameObject, ...args) => void;

        protected onDone: (self: pt.model.Event) => void;

        /**
         * cashe is saved in userdata
         */
        protected cache: any;

        private hasDone:boolean;
        private currentParent: pt.object.GameObject;

        /**
         *
         * @param onFire when Event#fire is called
         * @param onCreate when this event is added to GameObject
         * @param onUpdate called every frame if this event is fired ,until Event#done is called
         * @cache cache is saved in user savedata
         */
        constructor(onFire?: (from: pt.object.GameObject, parent?: pt.object.GameObject, ...args) => void, onCreate?: (parent: pt.object.GameObject, args?) => void, onUpdate?: (parent: pt.object.GameObject) => void, cache = {}) {
            this.onFire = onFire;
            this.onCreate = onCreate;
            this.onUpdate = onUpdate;
            this.cache = cache;
        }

        /**
         * Event#done is called
         */
        get HasDone():boolean {
            return this.hasDone;
        }

        public callOnCreate(parent: pt.object.GameObject, args?) {
            if (this.onCreate != null) {
                this.onCreate(parent, args);
            }
        }

        /**
         * fire event. this starts update loop until Event#done is called
         */
        public fire(from: pt.object.GameObject, parent?: pt.object.GameObject, onDone?, ...args) {
            console.log("ev fired");
            this.hasDone = false;

            if (parent && !parent.hasEvent(this)) {
                parent.addEvent(this);
            }

            if (this.onFire != null) {
                this.onFire(from, parent, args);
            }

            this.onDone = onDone;
        }

        private destroy() {
            this.hasDone = true;//done without onDone
            if (this.currentParent != null) {
                this.currentParent.removeEvent(this);
            }
            this.onDone = null;
        }

        public callOnUpdate(parent: pt.object.GameObject) {
            if (!this.hasDone && this.onUpdate != null) {
                this.onUpdate(parent);
            }
        }

        /**
         * stops update loop and call onDone callback set in Event#fire
         */
        public done(destroy = false) {
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
                cache: this.cache
            };

            for (var prop in this) {
                var spFunc = Event.isExFuncProp(prop);
                if (spFunc && typeof this[prop] === "function") {
                    ret[prop] = Event.funcToString(this[prop]);
                }
            }

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
            var ev = new Event(f, c, u, json.cache);

            for (var prop in json) {
                if (Event.isExFuncProp(prop)) {
                    ev[prop] = Event.funcToString(json[prop]);
                }
            }

            return ev;
        }
    }
}