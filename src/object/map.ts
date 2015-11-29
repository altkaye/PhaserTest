///<reference path="../../phaser/typescript/phaser.d.ts"/>
///<reference path="../model/mapdata.ts"/>
///<reference path="../sprite/maplayersprite.ts"/>

module pt.object {
    export class MapLayer extends Phaser.Group {
        private data: pt.model.MapLayerData;
        private sprite: pt.sprite.MapLayerSprite;

        get Sprite():pt.sprite.MapLayerSprite {
            return this.sprite;
        }

        constructor(game: Phaser.Game, data: pt.model.MapLayerData) {
            super(game);
            this.data = data;
            this.name = data.Name;
            this.sprite = new pt.sprite.MapLayerSprite(game, data);
            this.addChild(this.sprite);
        }

        public has(o) {
            return this.children.indexOf(o) >= 0;
        }

        /**
        public addChild(o) {
            if (o.layer) {
                o.layer = this.data.Name;
            }
            return super.addChild(o);
        }**/

        public addTile(id: number, x: number, y: number, chipset?: string | pt.model.ChipSet, passability?: pt.model.Passability, floor: boolean = true) {
            //console.log("addtile");
            if (floor) {
                x = Math.floor(x);
                y = Math.floor(y);
            }
            this.data.addTile(id, x, y, chipset, passability);

            //this.rebuild(this.data);//TODO
            for (var dx = -1; dx <= 1; dx++) {
                for (var dy = -1; dy <= 1; dy++) {
                    this.sprite.drawTile(this.game, dx + x, dy + y, this.data, false);
                }
            }
            this.sprite.updateTexture();
            //this.texture.requiresUpdate = true;
        }
    }

    export class Map extends Phaser.Group {
        private layers: Array<MapLayer>;
        private data:pt.model.MapData;

        get Layers(): Array<MapLayer> {
            return this.layers;
        }

        get Width(): number {
            return this.width;
        }

        get Height(): number {
            return this.height;
        }

        get Data():pt.model.MapData {
            return this.data;
        }

        get Center(): Phaser.Point {
            return new Phaser.Point(this.Width / 2, this.Height / 2);
        }

        public getLayer(n: string | number): MapLayer {
            var ret;
            if (typeof n === "string") {
                this.layers.forEach((l) => {
                    if (l.name === n) {
                        ret = l;
                    }
                });
            } else {
                if (n < this.layers.length) {
                    ret = this.layers[n];
                }
            }
            return ret;
        }

        public addGameObject(obj:pt.object.GameObject, layer?) {
            if (layer != null) {
                this.removeGameObject(obj);
                obj.layer = layer;
            }
            this.data.addGameObject(obj.Data);
            this.addChildInLayer(obj, obj.layer);
        }

        public removeGameObject(obj:pt.object.GameObject) {
            this.data.removeGameObject(obj.Data);
            this.removeChild(obj, true);
        }

        /** add object */
        public addChildInLayer(o:PIXI.DisplayObjectContainer, layer: string | number = 0) {
            var l = this.getLayer(layer);
            if (l) {
                return l.addChild(o);
            } else {
                return null;
            }
        }

        public getLayerOf(o:pt.object.GameObject) {
           for (var i = 0; i < this.layers.length; i++) {
               if (this.layers[i].has(o)) {
                   return this.layers[i];
               }
           }
           return null;
        }

        public removeChild(o:PIXI.DisplayObjectContainer, searchLayers = true) {
            if (!searchLayers) {
                return super.removeChild(o);
            }

            var index = this.children.indexOf(o);
            if (index >= 0) {
                return super.removeChild(o);
            } else {
                var ret;
                this.layers.forEach((l) => {
                    if (l.children.indexOf(o) >= 0) {
                        ret = l.removeChild(o);
                    }
                });
                return ret;
            }
        }

        constructor(game: Phaser.Game, data: pt.model.MapData) {
            super(game);
            this.data = data;
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