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
            //console.log(data);
            for (var x = 0; x < data.Column; x++) {
                for (var y = 0; y < data.Row; y++) {
                    var tile = data.getTile(x, y);
                    if (!tile.equals(pt.model.Tile.EMPTY)) {
                        var chipset = data.getChipSetOf(tile);
                        var image = game.cache.getImage(chipset.Key, true);

                        switch (chipset.Type) {
                            case pt.model.ChipSetType.DEFAULT:
                                this.drawDefaultTile(image.data, context, tile.Id, chipset.Size, x, y);
                                break;
                            case pt.model.ChipSetType.AUTO:
                                this.drawAutoTile(image.data, context, tile, chipset.Size, x, y, data);
                                break;
                        }
                    }
                }
            }

            return new PIXI.Texture(new PIXI.BaseTexture(canvas, PIXI.scaleModes.DEFAULT));
        }

        private drawAutoTile(image: HTMLImageElement, context: CanvasRenderingContext2D, tile: pt.model.Tile, chipsetSize: number, x: number, y: number, data: pt.model.MapLayerData, layerTileSize = chipsetSize) {
            /**
             * [0,0][1,0]
             * [0,1][1,1]
             * split 4 per 1 tile.
             **/
            for (var i = 0; i <= 1; i++) {
                for (var j = 0; j <= 1; j++) {
                    //which corner to check
                    var cx = (i == 0 ? x - 1 : x + 1);
                    var cy = (j == 0 ? y - 1 : y + 1);
                    //which to check, top or bottom
                    var tby = (j == 0 ? y - 1 : y + 1);
                    //which to check, left or right
                    var lrx = (i == 0 ? x - 1 : x + 1);

                    var cornerTile = data.getTile(cx, cy);
                    var lrTile = data.getTile(lrx, y);
                    var tbTile = data.getTile(x, tby);

                    var src = {
                        x: 0, y: 0, w: 0, h: 0
                    };
                    src.w = chipsetSize / 2;
                    src.h = chipsetSize / 2;

                    var row = 0;
                    //check which tile we should use

                    if (tile.equals(cornerTile) && tile.equals(lrTile) && tile.equals(tbTile)) {
                        row = 4;
                    } else if (tile.equals(lrTile) && tile.equals(tbTile)) {
                        row = 3;
                    } else if (tile.equals(lrTile)) {
                        row = 2;
                    } else if (tile.equals(tbTile)) {
                        row = 1;
                    }

                    src.x = i * chipsetSize / 2; //column
                    src.y = (j * chipsetSize / 2) + chipsetSize * row; //row

                    var dst = {
                        x: x * layerTileSize,
                        y: y * layerTileSize,
                        w: layerTileSize,
                        h: layerTileSize
                    }
                    dst.x += chipsetSize / 2;
                    dst.w /= 2;
                    dst.y += (j * chipsetSize / 2);
                    dst.h /= 2;
                    context.drawImage(image,
                        src.x, src.y, src.w, src.h,
                        dst.x, dst.y, dst.w, dst.h);
                }
            }
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