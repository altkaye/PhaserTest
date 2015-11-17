///<reference path="../../phaser/typescript/phaser.d.ts"/>
///<reference path="../sprite/charactersprite.ts"/>
///<reference path="../util/phaserutil.ts"/>
///<reference path="../model/event.ts"/>
///<reference path="../model/object.ts"/>

module pt.object {
    export class GameObject extends Phaser.Sprite {
        protected id:string;
        //protected name:string;
        //protected objectName:string;
        protected forward:Phaser.Point;
        protected imageKey:string;
        protected event:pt.model.Event;
        protected objectType:pt.model.GameObjectType;
        protected layer:number;

        protected cache:any;

        constructor(game:Phaser.Game, data:pt.model.GameObjectData = pt.model.GameObjectData.EMPTY()) {
            super(game, data.position.x, data.position.y);
            this.id = data.id;
            this.name = data.name;
            this.forward = new Phaser.Point(data.forward.x, data.forward.y);
           // this.position.setTo(data.position.x, data.position.y);
            this.imageKey = data.key;
            this.event = data.event;
            this.objectType = data.objectType;
            this.cache = data.cache;
        }

        public toData():pt.model.GameObjectData {
            return new pt.model.GameObjectData(
                this.name,
                this.imageKey,
                {x:this.position.x, y:this.position.y, layer:this.layer},
                this.forward,
                this.id,
                this.event,
                this.objectType,
                this.cache
            );
        }
    }
}