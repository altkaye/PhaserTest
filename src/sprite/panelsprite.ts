///<reference path="../../phaser/typescript/phaser.d.ts"/>
module pt.sprite {
    export class PanelSprite extends Phaser.Sprite {
        constructor(game: Phaser.Game, x: number, y: number, width: number, height: number, key: string) {
            var texture = this.build(width, height, game.cache.getImage(key, true));
            super(game, x, y, texture);
        }

        private build(width: number, height: number, image: Phaser.CachedImage): PIXI.Texture {
            var canvas = PIXI.CanvasPool.create(<any>this, width, height);//TODO must be bug of pixi.d.ts. parent is not HTMLElement actually
            var context = canvas.getContext("2d");

            console.log(image);
            var src = {
                w: 0, h: 0, x: 0, y: 0
            };
            var dst = {
                w: 0, h: 0, x: 0, y: 0
            };
            src.w = image.data.width / 3;
            src.h = image.data.height / 3;

            var centerX = src.w;
            var centerY = src.h;
            var centerW = width - (src.w * 2);
            var centerH = height - (src.h * 2);

            // corner
            for (var i = 0; i <= 1; i++) {
                for (var k = 0; k <= 1; k++) {
                    //var dst = {};
                    dst.x = (centerX + centerW) * i;
                    dst.w = src.w;
                    dst.y = (centerY + centerH) * k;
                    dst.h = src.h;
                    src.x = src.w * i * 2;
                    src.y = src.h * k * 2;

                    context.drawImage(image.data, src.x, src.y, src.w, src.h,
                        dst.x, dst.y, dst.w, dst.h);
                }
            }

            // top and bottom
            for (var i = 0; i <= 1; i++) {
                //var dst = {};
                dst.x = src.w;
                dst.y = (centerY + centerH) * i;
                dst.w = centerW;
                dst.h = src.h;
                src.x = src.w;
                src.y = i * 2 * src.h;

                context.drawImage(image.data, src.x, src.y, src.w, src.h,
                    dst.x, dst.y, dst.w, dst.h);
            }

            //left and right
            for (var i = 0; i <= 1; i++) {
                dst.x = (centerX + centerW) * i;
                dst.y = centerY;
                dst.w = src.w;
                dst.h = centerH;
                src.x = src.w * i * 2;
                src.y = src.h;
                context.drawImage(image.data, src.x, src.y, src.w, src.h,
                    dst.x, dst.y, dst.w, dst.h);
            }

            //center
            src.x = src.w;
            src.y = src.h;
            context.drawImage(image.data, src.x, src.y, src.w, src.h,
                centerX, centerY, centerW, centerH);
            return new PIXI.Texture(new PIXI.BaseTexture(canvas, PIXI.scaleModes.DEFAULT));
        }

        public update(): void {
            //console.log("update");
        }
    }
}