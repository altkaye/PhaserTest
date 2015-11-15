module pr.model {
    export function buildSampleMap(): MapData {
        var ret = new MapData(0, "sample map", 30, 30);

        return null;
    }

    export enum Passability {
        PASSABLE = 0, IMPASSABLE = -1
    }

    export class Tile {
        private key: string;
        private id: number;
        constructor(key:string, id:number) {
            this.key = key;
            this.id = id;
        }
    }

    export class MapLayerData {
        private name: string;
        private column: number;
        private row: number;
        private chipsets: Array<ChipSet>;
        private tiles: Array<Tile>;
        private passabilities: Array<Passability>;

        constructor(name: string, column: number, row: number, chipsets: Array<ChipSet> = [], tiles: Array<Tile> = [], passabilities: Array<Passability> = []) {
            this.name = name;
            this.column = column;
            this.row = row;
            this.chipsets = chipsets;
            this.tiles = tiles;
            this.passabilities = passabilities;
        }

        public addTile(id: number, x: number, y: number, chipsetKey: string | ChipSet = this.chipsets[0], passability?:Passability): boolean {
            var chipset:ChipSet;

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
                var tile = new pr.model.Tile(chipset.Key, id);
                this.tiles[this.getIndexOf(x, y)] = tile;
                passability = passability || chipset.getPassability(id);
                this.setPassability(x, y, passability);
                return true;
            } else if (typeof chipsetKey !== "string") {
                this.addChipset(chipsetKey);
                var tile = new pr.model.Tile(chipsetKey.Key, id);
                this.tiles[this.getIndexOf(x, y)] = tile;
                passability = passability || chipsetKey.getPassability(id);
                this.setPassability(x, y, passability);
                return true;
            } else {
                return false;
            }
        }

        public setPassability(x:number, y:number, pass:Passability) {
            this.passabilities[this.getIndexOf(x, y)] = pass;
        }

        private getIndexOf(x:number, y:number):number {
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

        constructor(id: number, name: string, column: number, row: number, layers: Array<MapLayerData> = []) {
            this.id = id;
            this.name = name;
            this.column = column;
            this.row = row;

            this.layers = layers;
        }

        public addLayer(layer: MapLayerData, index: number = this.layers.length): MapData {
            this.layers[index] = layer;
            return this;
        }
    }

    export class ChipSet {
        public static TYPE_DEFAULT = "default";
        public static TYPE_AUTOTILE = "auto";

        private key: string;
        private path: string;
        private type: string;
        private defaultPassability: Array<Passability>;

        constructor(key: string, path: string, type: string = pr.model.ChipSet.TYPE_DEFAULT, defaultPassability: Array<number> = [0]) {
            this.key = key;
            this.path = path;
            this.type = type;
            this.defaultPassability = defaultPassability;
        }

        get Key(): string {
            return this.key;
        }

        public getPassability(id:number):Passability {
            if (this.defaultPassability.length <= id) {
                return Passability.PASSABLE;
            } else {
                return this.defaultPassability[id];
            }
        }

        public equals(c:ChipSet) : boolean {
            return this.key === c.Key;//TODO
        }
    }
}