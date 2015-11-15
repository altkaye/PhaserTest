///<reference path="../../phaser/typescript/phaser.d.ts"/>

module pt.sprite {
    export class MapLayerSprite extends Phaser.Sprite {
        private canvas: HTMLCanvasElement;
        private context: CanvasRenderingContext2D;

        constructor(game: Phaser.Game) {
            super(game, 0, 0);
            this.canvas = PIXI.CanvasPool.create(<any>this, 640, 480);//TODO must be bug of pixi.d.ts. parent is not HTMLElement actually
            this.context = this.canvas.getContext("2d");
            this.anchor.set(0.5, 0.5);
            this.position.setTo(320, 240);
            this.build();
        }

        private build(): void {
            this.setTexture(new PIXI.Texture(new PIXI.BaseTexture(this.canvas, PIXI.scaleModes.DEFAULT)));
            var image: any = this.game.cache.getImage("tile");
            console.log(image);
            this.context.drawImage(image, 0, 0, 32, 32, 0, 0, 32, 32);
            this.context.drawImage(image, 32, 32, 32, 32, 32, 32, 32, 32);
        }

        public update(): void {
            //console.log("update");
        }

    }
}