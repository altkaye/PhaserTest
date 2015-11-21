///<reference path="../../phaser/typescript/phaser.d.ts"/>
///<reference path="../object/map.ts"/>
///<reference path="../../mithril/mithril.d.ts"/>

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

        public startLoadingMap(filePath: string, mapName: string = "editingdata") {
            this.game.load.json(mapName, filePath).onLoadComplete.add(() => {
                var data = pt.model.MapData.fromJSON(this.game.cache.getJSON(mapName));

                this.game.load.images(data.AssetKeys, data.AssetPaths).onLoadComplete.add(() => {
                    this.setMap(data);
                });
            });
        }

        private setMap(data) {
            this.map = new pt.object.Map(this.game, data);
            if (this.map != null) {
                this.world.remove(this.map);
            }
            this.world.add(this.map);
            this.setLayerEvent();
        }

        private dispatchLayerEvents(index = this.currentLayer) {
            this.map.Layers[index].Sprite.events.onInputDown.removeAll();
        }

        private setLayerEvent(index = this.currentLayer) {
            this.map.Layers[index].Sprite.events.onInputDown.add(this.putTile);
        }

        private putTile(p: Phaser.Pointer) {
            var l = this.map.Layers[this.currentLayer];
            var local = pt.util.worldToLocal(p.worldX, p.worldY, l);
            local.x /= 32;
            local.y /= 32;
            l.addTile(this.tile.Id, local.x, local.y);
        }

        public update() {
        }
    }
}