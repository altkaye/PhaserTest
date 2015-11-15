///<reference path="../../phaser/typescript/phaser.d.ts"/>

module pt.sprite {
    /**
     * definition of character actor sprite
     * wolf rpg editor format
     */
    export class CharacterSprite extends Phaser.Sprite {
        public static ANIM_DOWN: string = "down";
        public static ANIM_UP: string = "up";
        public static ANIM_LEFT: string = "left";
        public static ANIM_RIGHT: string = "right";
        public static ANIM_UPLEFT: string = "upleft";
        public static ANIM_UPRIGHT: string = "upright";
        public static ANIM_DOWNLEFT: string = "downleft";
        public static ANIM_DOWNRIGHT: string = "downright";

        /**
         * @param imageKey key of "image", not "spritesheet"
         */
        constructor(game: Phaser.Game, x: number, y: number, imageKey: string) {
            var imageData = game.cache.getImage(imageKey, true);
            var frameWidth = imageData.data.width / 6;
            var frameHeight = imageData.data.height / 4;
            var newKey = imageKey + "_ss";

            game.cache.addSpriteSheet(newKey, imageData.url, imageData.data, frameWidth, frameHeight);
            super(game, x, y, newKey);

            this.defineAnimations();
        }

        private defineAnimations(): void {
            var self = pt.sprite.CharacterSprite;
            var freq = 4;
            this.animations.add(self.ANIM_DOWN, [0, 1, 2, 1], freq, true);
            this.animations.add(self.ANIM_DOWNLEFT, [3, 4, 5, 4], freq, true);
            this.animations.add(self.ANIM_LEFT, [6, 7, 8, 7], freq, true);
            this.animations.add(self.ANIM_DOWNRIGHT, [9, 10, 11, 10], freq, true);
            this.animations.add(self.ANIM_RIGHT,[12, 13, 14, 13], freq, true);
            this.animations.add(self.ANIM_UPLEFT, [15, 16, 17, 16], freq, true);
            this.animations.add(self.ANIM_UP, [18, 19, 20, 19], freq, true);
            this.animations.add(self.ANIM_UPRIGHT, [21, 22, 23, 22], freq, true);
        }

    }
}