///<reference path="../../phaser/typescript/phaser.d.ts"/>
///<reference path="../object/map.ts" />
///<reference path="../model/mapdata.ts" />
///<reference path="../model/move.ts" />
///<reference path="../model/wait.ts" />
///<reference path="../model/eventflow.ts" />
///<reference path="../sprite/charactersprite.ts" />
///<reference path="../sprite/panelsprite.ts" />
///<reference path="../sprite/messagewindow.ts" />
///<reference path="../object/gameobject.ts"/>
///<reference path="../util/phaserutil.ts" />

module pt.test {
    export class TestState extends Phaser.State {
        private cursol: Phaser.CursorKeys;

        public preload(): void {
            this.load.image("enemy", "img/Enemy/pipo-enemy001.png");
            this.load.image("enemy2", "img/Enemy/pipo-enemy002.png");
            this.load.image("m_town", "img/MapChip/nekura1/m_town.png");
            this.load.image("t_town02", "img/MapChip/nekura1/t_town02.png");
            this.load.image("chara", "img/CharaChip/16_hero1.png");
            this.load.image("02_town2", "img/CharaChip/02_town2.png");
            this.load.image("panel", "img/Panel/pipo/pipo-WindowBase006.png")
            this.game.time.advancedTiming = true;
        }

        public create(): void {
            super.create();
            this.cursol = this.game.input.keyboard.createCursorKeys();
            var map = this.testMapLoading();
            this.testSpriteNest();
            this.testPanel();
            this.testGameObjAndFlow(map);
            this.testMessageWindow();
        }

        public update(): void {
            //testing camera and input
            super.update();
            if (this.cursol.up.isDown) {
                this.game.camera.y -= 4;
            } else if (this.cursol.down.isDown) {
                this.game.camera.y += 4;
            }
            if (this.cursol.left.isDown) {
                this.game.camera.x -= 4;
            } else if (this.cursol.right.isDown) {
                this.game.camera.x += 4;
            }
        }

        private testMessageWindow() {
            var win = new pt.sprite.MessageWindow(this.game, "panel");
            win.setOnClose((m) => {
                console.log("mes closed");
            });
            win.open("<p>space to next</p><p>hello world</p>");
        }

        private testSpriteNest() {
            //testing objects and nest
            var sample: Phaser.Sprite = this.game.add.sprite(320, 240, "enemy");
            sample.anchor.setTo(0.5, 0.5);

            var sample02: Phaser.Sprite = new Phaser.Sprite(this.game, 0, 0, "enemy2");
            sample02.anchor.setTo(0.5, 0.5);
            sample.addChild(sample02);
            sample02.position.setTo(100, 100);
        }

        private testPanel() {
            var panel: Phaser.Sprite = new pt.sprite.PanelSprite(this.game, 100, 100, 100, 60, "panel");
            this.world.addChild(panel);
            panel.anchor.setTo(0.5, 0.5);
            panel.inputEnabled = true;
            panel.input.priorityID = 2;
            panel.events.onInputDown.add((s, p) => {
                var pointer: Phaser.Pointer = p;
                console.log(s);
                //this.world.removeChild(panel);
                console.log(pt.util.worldToLocal(pointer.worldX, pointer.worldY, panel));
                panel.worldPosition.set(pointer.worldX, pointer.worldY);
            });
        }

        private testMapLoading() {
            var data = pt.model.buildSampleMapData(22, 16);
            var json = JSON.parse(JSON.stringify(data));
            console.log(json);
            var reverted = pt.model.MapData.fromJSON(json);
            console.log(reverted);
            var map = new pt.object.Map(this.game, reverted);
            this.world.addChild(map);
            //map.position.setTo(map.Center.x, map.Center.y);
            this.world.setBounds(0, 0, map.Width, map.Height);

            map.Layers[0].Sprite.inputEnabled = true;
            map.Layers[0].Sprite.input.priorityID = 1;
            map.Layers[0].Sprite.events.onInputDown.add((l: pt.object.MapLayer, p: Phaser.Pointer) => {
                var local = pt.util.worldToLocal(p.worldX, p.worldY, map.Layers[0]);
                local.x /= 32;
                local.y /= 32;
                console.log("map clicked:" + JSON.stringify(local));
                map.Layers[0].addTile(0, local.x, local.y, new pt.model.ChipSet("t_town02", "", 32, pt.model.ChipSetType.AUTO));
            });

            return map;
        }

        private testGameObjAndFlow(map: pt.object.Map) {
            //test serialize
            var jsonStr = JSON.stringify(pt.model.buildSampleObj().toJSON());
            var json = JSON.parse(jsonStr);
            var data = pt.model.GameObjectData.fromJSON(json);

            var sample4 = new pt.object.GameObject(this.game, data);
            sample4.position.setTo(100, 100);
            var moveArg = pt.model.Move.buildArg(sample4.position.x, sample4.position.y, 64);
            map.addChildInLayer(sample4);
            var flow = new pt.model.EventFlow();
            flow.next(new pt.model.Move(), sample4, null, moveArg)
                .next(new pt.model.Wait(), sample4, null, 1)
                .then(() => {
                    moveArg.to.x = Math.random() * this.world.width;
                    moveArg.to.y = Math.random() * this.world.height;
                })
                .loop();
        }

        public render(): void {
            this.game.debug.cameraInfo(this.game.camera, 0, 32);
            this.game.debug.text("fps:" + this.game.time.fps, 0, 16);
        }
    }
}