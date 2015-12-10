///<reference path="mapdata.ts" />

module pt.model {
    module FilePath {
        const root = "./data/";
        const MAP_DIR = root + "map/";
        const ITEMS = root + "items.json";
        const STORAGE = root + "storage.json";
        const PARTY = root + "party.json";
        const BATTLER = root + "battler.json";
        const PREF = root + "config.json";

        export function mapData(name): string {
            return root + MAP_DIR + name + ".json";
        }
    }

    export class ProjectData {
        private name: string;
        private version: number;
        private versionName: string;
        
        //data
        private maps: Array<string>;
        private items: Array<any>;//TODO
        private battler: Array<any>;//TODO
        private party: Array<string>;//TODO
        private storage: any;//TODO
    }
}