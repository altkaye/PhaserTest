///<reference path="../phaser/typescript/phaser.d.ts"/>

module pr {
    export class MapLayerSprite extends Phaser.Sprite {
        private canvas: HTMLCanvasElement;
        private context: CanvasRenderingContext2D;

        constructor(game: Phaser.Game) {
            super(game, 0, 0);
            var self: any = this;
            this.canvas = PIXI.CanvasPool.create(self, 32, 32);//TODO must be bug of pixi.d.ts
            this.context = this.canvas.getContext("2d");

            this.build();
        }

        private build(): void {
            this.setTexture(new PIXI.Texture(new PIXI.BaseTexture(this.canvas, PIXI.scaleModes.DEFAULT)));
            var image: any = this.game.cache.getImage("tile");
            console.log(image);
            this.context.drawImage(image, 0, 0, 32, 32, 0, 0, 32, 32);

        }

        public update(): void {
            //console.log("update");
        }

    }
}