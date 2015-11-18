///<reference path="../../phaser/typescript/phaser.d.ts"/>
///<reference path="../sprite/charactersprite.ts"/>
///<reference path="../util/phaserutil.ts"/>
///<reference path="../model/event.ts"/>
///<reference path="../model/object.ts"/>

module pt.object {
    export class GameObject extends Phaser.Group {
        protected id:string;
        protected forward:Phaser.Point;
        protected imageKey:string;
        protected gameEvents:Array<pt.model.Event>;
        protected imageType:pt.model.ImageType;
        protected layer:number;
        protected frame:string|number;

        private sprite:pt.sprite.CharacterSprite|Phaser.Sprite;

        protected cache:any;

        get Sprite():pt.sprite.CharacterSprite|Phaser.Sprite {
            return this.sprite;
        }

        get ImageType():pt.model.ImageType {
            return this.imageType;
        }

        get Cache() {
            return this.cache;
        }

        constructor(game:Phaser.Game, data:pt.model.GameObjectData = pt.model.GameObjectData.EMPTY()) {
            super(game);
            this.id = data.id;
            this.name = data.name;
            this.forward = new Phaser.Point(data.forward.x, data.forward.y);
            this.imageKey = data.key;
            this.gameEvents = data.gameEvents;
            this.imageType = data.imageType;
            this.cache = data.cache;
            this.frame = data.frame;

            this.updateSprite();

            this.position.setTo(data.position.x, data.position.y);
        }

        public updateForward(f:Phaser.Point) {
            this.forward = f;
            if (this.imageType === pt.model.ImageType.CHARACTER) {
                (<pt.sprite.CharacterSprite>this.sprite).updateAnimation(f);
            }
        }

        public addEvent(ev:pt.model.Event) :pt.model.Event {
            this.gameEvents.push(ev);
            ev.callOnCreate(this);

            return ev;
        }

        private updateSprite(game:Phaser.Game = this.game, key:string = this.imageKey, imageType:pt.model.ImageType = this.imageType, frame = this.frame) {
            if (this.sprite && this.children.indexOf(this.sprite) >= 0) {
                this.removeChild(this.sprite);
            }

            if (imageType === pt.model.ImageType.CHARACTER) {
                var sp = new pt.sprite.CharacterSprite(game, 0, 0, key);
                this.sprite = sp;
                sp.updateAnimation(this.forward);
            } else if (imageType === pt.model.ImageType.SPRITE) {
                this.sprite = new Phaser.Sprite(game, 0, 0, key);
            } else if (imageType === pt.model.ImageType.SPRITESHEET) {
                this.sprite = new Phaser.Sprite(game, 0, 0, key, frame);
            }　else {
                return;
            }

            this.addChild(this.sprite);
            this.sprite.anchor.set(0.5, 0.5);
        }

        public update() {
            super.update();
            //console.log("update");
            this.gameEvents.forEach((e) => {
                e.callOnUpdate(this);
            });
        }

        public toData():pt.model.GameObjectData {
            return new pt.model.GameObjectData(
                this.name,
                this.imageKey,
                {x:this.position.x, y:this.position.y, layer:this.layer},
                this.forward,
                this.id,
                this.gameEvents,
                this.imageType,
                this.cache,
                this.sprite.frame
            );
        }
    }
}