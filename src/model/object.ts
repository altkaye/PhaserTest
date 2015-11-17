///<reference path="event.ts"/>
module pt.model {
    export enum GameObjectType {
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
        public objectType:GameObjectType;
        public cache:any;

        constructor(name:string, key:string, position:{x:number, y:number, layer:number} = {x:0, y:0, layer:0}, forward:{x:number, y:number} = {x:0, y:0}, id:string = "",  event:pt.model.Event = null, type:GameObjectType = GameObjectType.CHARACTER, cache = {}) {
            this.id = id;
            this.name = name;
            this.position = position;
            this.forward = forward;
            this.key = key;
            this.event = event;
            this.objectType = type;
            this.cache = cache;
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
                json.cache
            )
        }
    }
}