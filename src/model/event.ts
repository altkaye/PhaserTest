
///<reference path="../object/gameobject.ts"/>
module pt.model {
    export class Event {
        protected onUpdate : (parent:pt.object.GameObject) => void;
        protected onCreate : (parent:pt.object.GameObject, args?) => void;
        protected onFire : (from:pt.object.GameObject, parent?:pt.object.GameObject, args?) => void;

        /**
         * cashe is saved in json
         */
        protected cache: any;

        constructor(onFire?: (from:pt.object.GameObject, parent?:pt.object.GameObject, args?)=> void, onCreate?: (parent:pt.object.GameObject, args?) => void, onUpdate?: (parent:pt.object.GameObject) => void, cache = {}) {
            this.onFire = onFire;
            this.onCreate = onCreate;
            this.onUpdate = onUpdate;
            this.cache = cache;
        }

        public callOnCreate(parent:pt.object.GameObject, args?) {
            if (this.onCreate) {
                this.onCreate(parent, args);
            }
        }

        public callOnFire(from:pt.object.GameObject, parent?:pt.object.GameObject, args?) {
            if (this.onFire) {
                this.onFire(from, parent, args);
            }
        }

        public callOnUpdate(parent:pt.object.GameObject) {
            if (this.onUpdate) {
                this.onUpdate(parent);
            }
        }

        public toJSON() {
            return {
                onUpdate:　this.onUpdate ? "" + this.onUpdate : null,
                onCreate: this.onCreate ? "" + this.onCreate : null,
                onFire: this.onFire ? "" + this.onFire : null,
                cache:this.cache
            }
        }

        public static fromJSON(json):Event {
            var f = eval(json.onFire);
            var c = eval(json.onCreate);
            var u = eval(json.onUpdate);
            return new Event(f, c, u, json.cache);
        }
    }
}