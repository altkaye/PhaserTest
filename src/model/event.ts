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

        public callOnFire(from, parent?) {
            this.onFire(from, parent);
        }

        public toJSON() {
            return {
                onUpdate:　"" + this.onUpdate,
                onCreate: "" + this.onCreate,
                onFire: "" + this.onFire
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