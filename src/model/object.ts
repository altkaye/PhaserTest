///<reference path="event.ts"/>
module pt.model {
    export enum ImageType {
        CHARACTER = 0, SPRITE = 1, SPRITESHEET = 2
    }

    export class GameObjectData {
        public static EMPTY(): GameObjectData {
            return new GameObjectData("", "");
        }

        public id: string;
        public name: string;
        public position: { x: number, y: number, layer: number };
        public forward: { x: number, y: number };
        public key: string;
        public gameEvents: Array<pt.model.Event>;
        public imageType: ImageType;
        public frame: number | string;
        public storage: any;
        public width: number;
        public height: number;

        constructor(name: string = "", key: string = "", position: { x: number, y: number, layer: number } = { x: 0, y: 0, layer: 0 }, forward: { x: number, y: number } = { x: 0, y: 0 }, id: string = "", events: Array<pt.model.Event> = [], type: ImageType = ImageType.CHARACTER, storage = {}, frame: string | number = 0, width = -1, height = -1) {
            this.id = id;
            this.name = name;
            this.position = position;
            this.forward = forward;
            this.key = key;
            this.gameEvents = events;
            this.imageType = type;
            this.storage = storage;
            this.frame = frame;
            this.width = width;
            this.height = height;
        }

        public getHitRect(): Phaser.Rectangle {
            return new Phaser.Rectangle(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
        }

        public toJSON() {
            var ret: any = {};

            for (var prop in this) {
                if (typeof this[prop] !== "function") {
                    ret[prop] = this[prop];
                }
            }

            ret.gameEvents = [];
            this.gameEvents.forEach((e) => {
                ret.gameEvents.push(e.toJSON());
            })
            return ret;
        }

        public static fromJSON(json) {
            var events = [];
            json.gameEvents.forEach((e) => {
                events.push(pt.model.Event.fromJSON(e));
            })
            return new pt.model.GameObjectData(
                json.name,
                json.key,
                json.position,
                json.forward,
                json.id,
                events,
                json.objectType,
                json.storage,
                json.frame
            )
        }
    }

    export class ObjectBuilder {
        private data:GameObjectData;

        constructor() {
            this.data = new GameObjectData();
        }

        public name(val) {
            this.data.name = val;
            return this;
        }

        public key(val) {
            this.data.key = val;
            return this;
        }

        public position(x, y) {
            this.data.position.x = x;
            this.data.position.y = y;
            return this;
        }

        public forward(x, y) {
            this.data.forward.x = x;
            this.data.forward.y = y;
            return this;
        }

        public id(val) {
            this.data.id = val;
            return this;
        }

        public event(e) {
            this.data.gameEvents.push(e);
            return this;
        }

        public events(es) {
            es.forEach((e) => {
                this.event(e);
            });
            return this;
        }

        public width(val) {
            this.data.width = val;
            return this;
        }

        public height(val) {
            this.data.height = val;
            return this;
        }

        public build() {
            return this.data;
        }
    }

    export function buildSampleObj(): GameObjectData {
        var ret = new GameObjectData("npc1", "02_town2", {
            x: 400, y: 200, layer: 1
        });
        return ret;
    }
}