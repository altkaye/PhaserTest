///<reference path="../../phaser/typescript/phaser.d.ts"/>
///<reference path="../sprite/charactersprite.ts"/>
///<reference path="../util/phaserutil.ts"/>
///<reference path="gameobject.ts"/>

module pt.object {
    export class Character extends pt.object.GameObject  {
        private sprite: pt.sprite.CharacterSprite;

        constructor(game:Phaser.Game, key:string) {
            super(game);
            this.sprite = new pt.sprite.CharacterSprite(game, 0, 0, key);
            this.imageKey = key;
            this.sprite.anchor.setTo(0.5, 0.5);
            this.addChild(this.sprite);
            this.forward = pt.util.Point.DOWN;
            this.updateAnimation();
        }

        protected updateAnimation(forward = this.forward) :void{
            var anim = this.sprite.getWalkAnimation(forward);
            if (this.sprite.animations.currentAnim.name !== anim) {
                this.sprite.animations.play(anim);
            }
        }
    }
}