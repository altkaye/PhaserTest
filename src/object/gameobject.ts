///<reference path="../../phaser/typescript/phaser.d.ts"/>
///<reference path="../sprite/charactersprite.ts"/>
///<reference path="../util/phaserutil.ts"/>
///<reference path="../model/event.ts"/>
///<reference path="../model/object.ts"/>

module pt.object {
    export class GameObject extends Phaser.Group {
        private data:pt.model.GameObjectData;
        private sprite:pt.sprite.CharacterSprite|Phaser.Sprite;

        get id():string {
            return this.data.id;
        };

        get Position():Phaser.Point {
            return this.position;
        }

        get forward():Phaser.Point {
            return new Phaser.Point(this.data.position.x, this.data.forward.y);
        };

        get imageKey():string {
            return this.data.key;
        };

        get gameEvents():Array<pt.model.Event> {
            return this.data.gameEvents;
        };

        get imageType():pt.model.ImageType {
            return this.data.imageType;
        };

        get layer():number {
            return this.data.position.layer;
        };

        set layer(v) {
            this.data.position.layer = v;
        }

        get frame():string|number {
            return this.data.frame;
        };

        get storage():any {
            return this.data.storage();
        };

        get Sprite():pt.sprite.CharacterSprite|Phaser.Sprite {
            return this.sprite;
        }

        get ImageType():pt.model.ImageType {
            return this.imageType;
        }

        get Storage() {
            return this.storage;
        }

        constructor(game:Phaser.Game, data:pt.model.GameObjectData = pt.model.GameObjectData.EMPTY()) {
            super(game);
            this.data = data;

            this.updateSprite();
            this.position.setTo(data.position.x, data.position.y);
        }

        public updateForward(f:Phaser.Point) {
            this.data.forward = f;
            if (this.imageType === pt.model.ImageType.CHARACTER) {
                (<pt.sprite.CharacterSprite>this.sprite).updateAnimation(f);
            }
        }

        public addEvent(ev:pt.model.Event) :pt.model.Event {
            this.gameEvents.push(ev);
            ev.callOnCreate(this);

            return ev;
        }

        public hasEvent(ev:pt.model.Event) : boolean {
            return this.gameEvents.indexOf(ev) >= 0;
        }

        public removeEvent(ev:pt.model.Event) {
            if (this.hasEvent(ev)) {
                this.gameEvents.splice(this.gameEvents.indexOf(ev), 1);
            }
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

        private syncData() {
            this.data.position.x = this.position.x;
            this.data.position.y = this.position.y;
        }

        public update() {
            super.update();
            //console.log("update");
            this.gameEvents.forEach((e) => {
                this.syncData();//TODO
                e.callOnUpdate(this);
            });
            this.syncData();
        }

        get Data():pt.model.GameObjectData {
            return this.data;
        }
    }
}