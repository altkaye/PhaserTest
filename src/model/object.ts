///<reference path="event.ts"/>
module pt.model {
    export enum ImageType {
        CHARACTER = 0, SPRITE = 1, SPRITESHEET = 2
    }

    export class GameObjectData {
        public static EMPTY():GameObjectData {
            return new GameObjectData("", "");
        }

        public id:string;
        public name:string;
        public position:{x:number, y:number, layer: number};
        public forward:{x:number, y:number};
        public key:string;
        public event:pt.model.Event;
        public imageType:ImageType;
        public frame:number|string;
        public cache:any;

        constructor(name:string, key:string, position:{x:number, y:number, layer:number} = {x:0, y:0, layer:0}, forward:{x:number, y:number} = {x:0, y:0}, id:string = "",  event:pt.model.Event = null, type:ImageType = ImageType.CHARACTER, cache = {}, frame:string|number = 0) {
            this.id = id;
            this.name = name;
            this.position = position;
            this.forward = forward;
            this.key = key;
            this.event = event;
            this.imageType = type;
            this.cache = cache;
            this.frame = frame;
        }

        public toJSON() {
            var ret = JSON.parse(JSON.stringify(this));
            ret.event = this.event.toJSON();
            return ret;
        }

        public static fromJSON(json) {
            return new pt.model.GameObjectData(
                json.name,
                json.key,
                json.position,
                json.forward,
                json.id,
                pt.model.Event.fromJSON(json.event),
                json.objectType,
                json.cache,
                json.frame
            )
        }
    }

    export function buildSampleObj():GameObjectData {
        var ret = new GameObjectData("npc1", "02_town2",{
            x:400, y:200, layer:1
        });
        return ret;
    }
}