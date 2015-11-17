///<reference path="../../phaser/typescript/phaser.d.ts"/>
///<reference path="../sprite/charactersprite.ts"/>
///<reference path="../util/phaserutil.ts"/>
///<reference path="../model/event.ts"/>
///<reference path="../model/object.ts"/>

module pt.object {
    export class GameObject extends Phaser.Group {
        protected id:string;
        protected objectName:string;
        protected forward:Phaser.Point;
        protected key:string;
        protected event:pt.model.Event;
        protected objectType:pt.model.GameObjectType;

        constructor(game:Phaser.Game, data:pt.model.GameObjectData = pt.model.GameObjectData.EMPTY()) {
            super(game);
            this.id = data.id;
            this.name = data.name;
            this.forward = new Phaser.Point(data.forward.x, data.forward.y);
            this.position.setTo(data.position.x, data.position.y);
            this.key = data.key;
            this.event = data.event;
            this.objectType = data.objectType;
        }

        public toData():pt.model.GameObjectData {
            return new pt.model.GameObjectData(
                this.name,
                this.key,
                this.position,
                this.forward,
                this.id,
                this.event,
                this.objectType
            );
        }
    }
}