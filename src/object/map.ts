///<reference path="../../phaser/typescript/phaser.d.ts"/>
///<reference path="../model/mapdata.ts"/>
///<reference path="../sprite/maplayersprite.ts"/>

module pt.object {
    export class MapLayer extends pt.sprite.MapLayerSprite {
        constructor(game: Phaser.Game, data: pt.model.MapLayerData) {
            super(game, data);
        }
    }

    export class Map extends Phaser.Group {
        private layers:Array<MapLayer>;

        get Width():number {
            return this.width;
        }

        get Height():number {
            return this.height;
        }

        get Center():Phaser.Point {
            return new Phaser.Point(this.Width / 2, this.Height / 2);
        }

        constructor(game: Phaser.Game, data: pt.model.MapData) {
            super(game);

            this.layers = [];
            data.Layers.forEach((l) => {
                var layer = new MapLayer(game, l);
                this.layers.push(layer);
                layer.anchor.set(0.5, 0.5);
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