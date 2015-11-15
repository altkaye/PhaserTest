///<reference path="../../phaser/typescript/phaser.d.ts"/>
///<reference path="../model/mapdata.ts"/>
module pt.sprite {
    export class MapLayerSprite extends Phaser.Sprite {
        // private data:pt.model.MapLayerData;

        constructor(game: Phaser.Game, data: pt.model.MapLayerData) {
            super(game, 0, 0, this.build(game, data));
            this.anchor.set(0.5, 0.5);
            this.position.setTo(data.getWidth() / 2, data.getHeight() / 2);
        }

        private build(game: Phaser.Game, data: pt.model.MapLayerData): PIXI.Texture {
            var canvas = PIXI.CanvasPool.create(<any>this, data.getWidth(), data.getHeight());//TODO must be bug of pixi.d.ts. parent is not HTMLElement actually
            var context = canvas.getContext("2d");

            for (var x = 0; x < data.Column; x++) {
                for (var y = 0; y < data.Row; y++) {
                    var tile = data.getTile(x, y);
                    var chipset = data.getChipSetOf(tile);
                    var image = game.cache.getImage(chipset.Key, true);

                    switch (chipset.Type) {
                        case pt.model.ChipSetType.DEFAULT:
                            this.drawDefaultTile(image.data, context, tile.Id, chipset.Size, x, y);
                            break;
                        case pt.model.ChipSetType.AUTO:
                            //TODO
                            break;
                    }

                }
            }

            return new PIXI.Texture(new PIXI.BaseTexture(canvas, PIXI.scaleModes.DEFAULT));
        }

        private drawDefaultTile(image: HTMLImageElement, context: CanvasRenderingContext2D, tileId: number, chipsetSize: number, x: number, y: number, layerTileSize = chipsetSize): void {
            var atlasColumn = image.width / chipsetSize;
            var src = {
                x: Math.floor(tileId % atlasColumn) * chipsetSize,
                y: Math.floor(tileId / atlasColumn) * chipsetSize,
                w: chipsetSize,
                h: chipsetSize
            }
            var dst = {
                x: x * layerTileSize,
                y: y * layerTileSize,
                w: layerTileSize,
                h: layerTileSize
            }
            context.drawImage(image, src.x, src.y, src.w, src.h, dst.x, dst.y, dst.w, dst.h);
        }

        public update(): void {
            //console.log("update");
        }

    }
}