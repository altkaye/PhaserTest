module pt.model {
    export class Event {
        private onUpdate : (parent) => void;
        private onCreate : (parent) => void;
        private onFire : (from, parent?) => void;

        constructor(onFire?: (from, parent?) => void, onCreate?: (parent) => void, onUpdate?: (parent) => void) {
            this.onFire = onFire;
            this.onCreate = onCreate;
            this.onUpdate = onUpdate;
        }

        public callOnCreate(parent) {
            if (this.onCreate) {
                this.onCreate(parent);
            }
        }

        public callOnFire(from, parent?) {
            if (this.onFire) {
                this.onFire(from, parent);
            }
        }

        public callOnUpdate(parent) {
            if (this.onUpdate) {
                this.onUpdate(parent);
            }
        }

        public toJSON() {
            return {
                onUpdate:　this.onUpdate ? "" + this.onUpdate : null,
                onCreate: this.onCreate ? "" + this.onCreate : null,
                onFire: this.onFire ? "" + this.onFire : null
            }
        }

        public static fromJSON(json):Event {
            var f = eval(json.onFire);
            var c = eval(json.onCreate);
            var u = eval(json.onUpdate);
            return new Event(f, c, u);
        }
    }
}