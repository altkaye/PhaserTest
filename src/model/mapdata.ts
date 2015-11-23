///<reference path="object.ts"/>

module pt.model {
    export function buildSampleMapData(col = 5, row = 5): MapData {
        var map = new MapData(0, "untitled", col, row);
        var layer = buildSampleMapLayer(col, row);
        map.addLayer(layer);

        return map;
    }

    export function buildSampleMapLayer(col = 30, row = 30): MapLayerData {
        var layer = new MapLayerData("layer01", col, row);
        var chipset = new ChipSet("m_town", "img/MapChip/nekura1/m_town.png", 32);
        for (var x = 0; x < col; x++) {
            for (var y = 0; y < col; y++) {
                layer.addTile(Math.round(Math.random() * 3), x, y, chipset);
            }
        }
        return layer;
    }

    export enum Passability {
        PASSABLE = 0, IMPASSABLE = -1
    }

    export enum ChipSetType {
        DEFAULT = 0, AUTO = 1
    }

    export class Tile {
        public static EMPTY: Tile = new Tile("", -1);

        private key: string;
        private id: number;

        get Key(): string {
            return this.key;
        }

        get Id(): number {
            return this.id;
        }

        public static fromJSON(json:any):Tile {
            return new Tile(json.key, json.id);
        }

        constructor(key: string, id: number) {
            this.key = key;
            this.id = id;
        }

        public equals(o: Tile): boolean {
            return o.Id === this.id && o.Key === this.key;
        }

    }

    export class MapLayerData {
        private name: string;
        private column: number;
        private row: number;
        private chipsets: Array<ChipSet>;
        private tiles: Array<Tile>;
        private passabilities: Array<Passability>;
        private tileSize: number;

        get Column(): number {
            return this.column;
        }
        get Row(): number {
            return this.row;
        }
        get Chipsets(): Array<ChipSet> {
            return this.chipsets;
        }
        get Name() :string {
            return this.name;
        }

        public static fromJSON(json:any) {
            var chipsets = [];
            json.chipsets.forEach((c) => {
                chipsets.push(ChipSet.fromJSON(c));
            });
            var tiles = []
            json.tiles.forEach((t) => {
                tiles.push(Tile.fromJSON(t));
            });
            return new MapLayerData(json.name, json.column, json.row, chipsets, tiles, json.passabilities, json.tileSize);
        }

        constructor(name: string, column: number, row: number, chipsets: Array<ChipSet> = [], tiles: Array<Tile> = [], passabilities: Array<Passability> = [], tileSize: number = 32) {
            this.name = name;
            this.column = column;
            this.row = row;
            this.chipsets = chipsets;
            this.tiles = tiles;
            this.tileSize = tileSize;
            this.passabilities = passabilities;
        }

        public getWidth(): number {
            return this.tileSize * this.column;
        }

        public getHeight(): number {
            return this.tileSize * this.row;
        }

        public getTile(x: number, y: number): Tile {
            var ret = this.tiles[this.getIndexOf(x, y)];
            if (!ret) {
                return Tile.EMPTY;
            } else {
                return ret;
            }
        }

        public getChipSetOf(tile: Tile): ChipSet {
            var ret;
            this.chipsets.forEach((c) => {
                if (tile.Key === c.Key) {
                    ret = c;
                }
            });
            return ret;
        }

        public addTile(id: number, x: number, y: number, chipsetKey: string | ChipSet = this.chipsets[0], passability?: Passability): boolean {
            var chipset: ChipSet;

            var has: boolean = this.chipsets.some((c) => {
                if (typeof chipsetKey === "string") {
                    if (c.Key === chipsetKey) {
                        chipset = c;
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (c.equals(<any>chipsetKey)) {
                        chipset = chipsetKey;
                        return true;
                    } else {
                        return false;
                    }
                }
            });

            if (has) {
                var tile = new pt.model.Tile(chipset.Key, id);
                this.tiles[this.getIndexOf(x, y)] = tile;
                passability = passability || chipset.getPassability(id);
                this.setPassability(x, y, passability);
                return true;
            } else if (typeof chipsetKey !== "string") {
                this.addChipset(chipsetKey);
                var tile = new pt.model.Tile(chipsetKey.Key, id);
                this.tiles[this.getIndexOf(x, y)] = tile;
                passability = passability || chipsetKey.getPassability(id);
                this.setPassability(x, y, passability);
                return true;
            } else {
                return false;
            }
        }

        public setPassability(x: number, y: number, pass: Passability) {
            this.passabilities[this.getIndexOf(x, y)] = pass;
        }

        private getIndexOf(x: number, y: number): number {
            return x + y * this.column;
        }

        public addChipset(chipset: ChipSet): MapLayerData {
            this.chipsets.push(chipset);
            return this;
        }
    }

    export class MapData {
        private id: number;
        private name: string;
        private column: number;
        private row: number;
        private layers: Array<MapLayerData>;
        private gameObjects: Array<GameObjectData>;

        get Name():string {
            return this.name;
        }

        /**
         * get all ChipSet used in this map
         */
        get Chipsets():Array<ChipSet> {
            var ret:Array<ChipSet> = [];
            this.layers.forEach((l) => {
                ret = ret.concat(l.Chipsets);
            });
            //remove duplication
            for (var i = 0; i < ret.length; i++) {
                for (var k = i + 1; k < ret.length; k++) {
                    if (ret[i].equals(ret[k])) {
                        ret.splice(k, 1);
                        k--;
                    }
                }
            }
            return ret;
        }

        get AssetKeys():Array<string> {
            var ret = [];
            this.Chipsets.forEach((c) => {
                ret.push(c.Key);
            })
            return ret;
        }

        get AssetPaths():Array<string> {
            var ret = [];
            this.Chipsets.forEach((c) => {
                ret.push(c.Path);
            })
            return ret;
        }


        public toJSON() {
            var ret = {
                id:this.id,
                name:this.name,
                column:this.column,
                row:this.row,
                layers:this.layers,
                gameObjects:[]
            }
            this.gameObjects.forEach((o) => {
                ret.gameObjects.push(o.toJSON());
            })
            return ret;
        }

        public toJSONString(space = 4): string {
            return JSON.stringify(this.toJSON(), null, space);
        }

        public static fromJSON(json:any):MapData {
            var layers = [];
            json.layers.forEach((l) => {
                layers.push(MapLayerData.fromJSON(l));
            });
            var objs = [];
            json.gameObjects.forEach((o) => {
                objs.push(GameObjectData.fromJSON(o));
            })
            var ret = new MapData(json.id, json.name, json.column, json.row, layers, objs);
            return ret;
        }

        constructor(id: number, name: string, column: number, row: number, layers: Array<MapLayerData> = [], objects = []) {
            this.id = id;
            this.name = name;
            this.column = column;
            this.row = row;

            this.layers = layers;
            this.gameObjects = objects;
        }


        get Layers():Array<MapLayerData> {
            return this.layers;
        }

        public addLayer(layer: MapLayerData, index?: number): MapData {
            if (index) {
                this.layers[index] = layer;
            } else {
                this.layers.push(layer);
            }
            return this;
        }
    }

    export class ChipSet {
        private key: string;
        private path: string;
        private type: ChipSetType;
        private defaultPassability: Array<Passability>;
        private size: number;

        get Key(): string {
            return this.key;
        }
        get Type(): ChipSetType {
            return this.type;
        }
        get Size(): number {
            return this.size;
        }
        get Path(): string {
            return this.path;
        }

        public static fromJSON(json:any):ChipSet {
            return new ChipSet(json.key, json.path, json.size, json.type, json.defaultPassability);
        }

        constructor(key: string, path: string, size = 32, type: ChipSetType = ChipSetType.DEFAULT, defaultPassability: Array<number> = [0]) {
            this.key = key;
            this.path = path;
            this.type = type;
            this.defaultPassability = defaultPassability;
            this.size = size;
        }

        public getPassability(id: number): Passability {
            if (this.defaultPassability.length <= id) {
                return Passability.PASSABLE;
            } else {
                return this.defaultPassability[id];
            }
        }

        public equals(c: ChipSet): boolean {
            return this.key === c.Key;//TODO
        }
    }
}