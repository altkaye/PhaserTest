///<reference path="../../phaser/typescript/phaser.d.ts"/>
///<reference path="../model/mapdata.ts"/>
///<reference path="../sprite/maplayersprite.ts"/>

module pt.object {
    export class MapLayer extends pt.sprite.MapLayerSprite {
        private data: pt.model.MapLayerData;
        constructor(game: Phaser.Game, data: pt.model.MapLayerData) {
            super(game, data);
            this.data = data;
        }

        public addTile(id: number, x: number, y: number, chipset?: string | pt.model.ChipSet, passability?: pt.model.Passability, floor:boolean = true) {
            //console.log("addtile");
            if (floor) {
                x = Math.floor(x);
                y = Math.floor(y);
            }
            console.log("addtile:" + this.data.addTile(id, x, y, chipset, passability));
            this.rebuild(this.data);//TODO
            //this.drawTile(this.game, x, y, this.data);
        }
    }

    export class Map extends Phaser.Group {
        private layers: Array<MapLayer>;

        get Layers(): Array<MapLayer> {
            return this.layers;
        }

        get Width(): number {
            return this.width;
        }

        get Height(): number {
            return this.height;
        }

        get Center(): Phaser.Point {
            return new Phaser.Point(this.Width / 2, this.Height / 2);
        }

        constructor(game: Phaser.Game, data: pt.model.MapData) {
            super(game);

            this.layers = [];
            data.Layers.forEach((l) => {
                var layer = new MapLayer(game, l);
                this.layers.push(layer);
                //layer.anchor.set(0.5, 0.5);
                this.addChild(layer);

                if (this.width < layer.width) {
                    this.width = layer.width;
                }

                if (this.height < layer.height) {
                    this.height = layer.height;
                }
            });
        }
    }
}