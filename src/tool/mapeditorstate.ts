///<reference path="../../phaser/typescript/phaser.d.ts"/>
///<reference path="../object/map.ts"/>
///<reference path="../../mithril/mithril.d.ts"/>
///<reference path="../util/phaserutil.ts"/>

module pt.tool {
    export class MapEditorState extends Phaser.State {
        private path: string;
        private map: pt.object.Map;
        private currentLayer = 0;

        private tile: pt.model.Tile;
        private chipset: pt.model.ChipSet;

        constructor() {
            super();
            //this.path = filePath;
        }

        public preload() {
            console.log("preload");
        }

        public create() {
            console.log("create");
        }

        public save() {
            pt.util.downloadAsFile(this.map.Data.Name + ".json", this.map.Data.toJSONString());
        }

        public startLoadingMap(filePath: string = "", mapName: string = "untitled.json") {
            console.log("start loading");
            this.path = filePath;
            if (filePath === "") {
                console.log("new file");
                var data = pt.model.buildSampleMapData();
                this.game.load.images(data.AssetKeys, data.AssetPaths).onLoadComplete.addOnce(() => {
                    console.log("done loading imgs");
                    this.setMap(data);
                });
                this.game.load.start();
            } else {
                this.game.load.json(mapName, filePath).onLoadComplete.add(() => {
                    var data = pt.model.MapData.fromJSON(this.game.cache.getJSON(mapName));
                    this.game.load.images(data.AssetKeys, data.AssetPaths).onLoadComplete.addOnce(() => {
                        this.setMap(data);
                    });
                    this.game.load.start();
                });
                this.game.load.start();
            }
        }

        private setMap(data:pt.model.MapData) {
            console.log("setmap");
            console.log(data);
            this.map = new pt.object.Map(this.game, data);
            if (this.map != null) {
                this.world.remove(this.map);
            }
            this.world.add(this.map);
            this.currentLayer = 0;
            this.setLayerEvent();
            this.setPaintTile();
        }

        private loadChipSetAsset(chipset:pt.model.ChipSet, onload = () => {}) {
            this.game.load.image(chipset.Key, chipset.Path).onFileComplete.addOnce(onload);
            this.game.load.start();
        }

        public addChipSet(c:pt.model.ChipSet, onDone?:()=>void) {
            this.map.Data.addChipSet(c);
            this.loadChipSetAsset(c, () => {
                onDone();
            });
        }

        public removeChipSet(chipset:pt.model.ChipSet) {
            this.map.Data.removeChipSet(chipset);
            
            if (this.tile.Key === chipset.Key) {
                this.setPaintTile();
            }
        }

        public setPaintTile(tile?:pt.model.Tile) {
            if (tile == null) {
                var chipsets = this.map.Data.Chipsets;
                tile = new pt.model.Tile(chipsets[0].Key, 0);
            }
            this.tile = tile;
        }

        public switchEditLayer(index = 0) {
            this.dispatchLayerEvents();
            this.setLayerEvent(index);
        }

        private dispatchLayerEvents(index = this.currentLayer) {
            this.map.getLayer(index).Sprite.events.onInputDown.removeAll();
        }

        private setLayerEvent(index = this.currentLayer) {
            this.map.getLayer(index).Sprite.inputEnabled = true;
            this.map.getLayer(index).Sprite.events.onInputDown.add((sp, p) => {
                console.log(p);
                this.putTile(p, this.tile);
            });
        }

        private putTile(p: Phaser.Pointer, tile = this.tile, l =  this.map.getLayer(this.currentLayer)) {
            console.log("put tile");
            console.log(this.map);
            var local = pt.util.worldToLocal(p.worldX, p.worldY, l);
            local.x /= 32;
            local.y /= 32;
            console.log(tile);
            console.log(local);
            l.addTile(tile.Id, local.x, local.y);
        }

        public update() {
        }
    }
}