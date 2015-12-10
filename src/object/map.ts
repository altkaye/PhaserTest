///<reference path="../../phaser/typescript/phaser.d.ts"/>
///<reference path="../model/mapdata.ts"/>
///<reference path="../sprite/maplayersprite.ts"/>

module pt.object {
    export class MapLayer extends Phaser.Group {
        private data: pt.model.MapLayerData;
        private sprite: pt.sprite.MapLayerSprite;

        private objectGroup: Phaser.Group;

        get Sprite():pt.sprite.MapLayerSprite {
            return this.sprite;
        }

        constructor(game: Phaser.Game, data: pt.model.MapLayerData) {
            super(game);
            this.data = data;
            this.name = data.Name;
            this.sprite = new pt.sprite.MapLayerSprite(game, data);
            this.objectGroup = new Phaser.Group(this.game);

            this.addChild(this.sprite);
            this.addChild(this.objectGroup);
        }

        public addGameObject(o: pt.object.GameObject, updateData: boolean = true) {
            this.objectGroup.addChild(o);
        }

        public removeGameObject(o: pt.object.GameObject, updateData: boolean = true) {
            return this.objectGroup.removeChild(o);
        }

        public hasGameObject(o: pt.object.GameObject) {
            return this.objectGroup.children.indexOf(o) >= 0;
        }

        private reorder() {
            this.objectGroup.sort("y", Phaser.Group.SORT_ASCENDING);
        }

        public update() {
            super.update();

            this.reorder();
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
        private data:pt.model.MapData;

        private layers: Array<MapLayer>;
        private gameObjects: Array<pt.object.GameObject>;

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

        public findEventById(id:string) {
            var ret = null;
            this.gameObjects.some((o) => {
                return (ret = o.findEventById(id)) != null;
            });
            return ret;
        }

        public fireEvents(from:pt.object.GameObject, rect:Phaser.Rectangle = from.getHitRect(), layer:number = from.layer, fireTop:boolean = false) {
            var objs = this.gameObjects;
            for (var i = 0; i < objs.length; i++) {
                var o = objs[i];

                if (o.layer == layer && pt.util.collidesRect(o.getHitRect(), rect)) {
                    console.log("found object");
                    o.fireEvents(from, null);
                }
            }
        }

        public addGameObject(obj:pt.object.GameObject, layer?, updateData = true) {
            if (layer != null) {
                this.removeGameObject(obj, updateData);
                obj.layer = layer;
            }
            if (updateData) {
                this.data.addGameObject(obj.Data);
            }
            this.gameObjects.push(obj);
            this.addObjectInLayer(obj, obj.layer);
        }

        public removeGameObject(obj:pt.object.GameObject, updateData = true) {
            if (updateData) {
                this.data.removeGameObject(obj.Data);
            }
            this.removeChild(obj, true);
            this.gameObjects.splice(this.gameObjects.indexOf(obj), 1);
        }

        /** add object */
        public addObjectInLayer(o:pt.object.GameObject, layer: string | number = 0) {
            var l = this.getLayer(layer);
            if (l) {
                return l.addGameObject(o);
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
                    } else if (l.hasGameObject(<any>o)) {
                        ret = l.removeGameObject(<any>o);
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

            this.gameObjects = [];
            data.getGameObjects().forEach((od) => {
                this.addGameObject(new pt.object.GameObject(game, od), od.position.layer, false);
            })
        }
    }
}