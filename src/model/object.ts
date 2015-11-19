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
        public cache: any;

        constructor(name: string, key: string, position: { x: number, y: number, layer: number } = { x: 0, y: 0, layer: 0 }, forward: { x: number, y: number } = { x: 0, y: 0 }, id: string = "", events: Array<pt.model.Event> = [], type: ImageType = ImageType.CHARACTER, cache = {}, frame: string | number = 0) {
            this.id = id;
            this.name = name;
            this.position = position;
            this.forward = forward;
            this.key = key;
            this.gameEvents = events;
            this.imageType = type;
            this.cache = cache;
            this.frame = frame;
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
                json.cache,
                json.frame
            )
        }
    }

    export function buildSampleObj(): GameObjectData {
        var ret = new GameObjectData("npc1", "02_town2", {
            x: 400, y: 200, layer: 1
        });
        return ret;
    }
}