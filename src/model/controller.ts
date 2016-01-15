///<reference path="event.ts"/>
///<reference path="mapdata.ts"/>
///<reference path="move.ts"/>
///<reference path="../object/map.ts"/>
///<reference path="../util/phaserutil.ts"/>
///<reference path="../manager/focusmanager.ts"/>

module pt.model {
    export class Controller extends pt.model.Event {
        private map: pt.object.Map;
        private speed: number;
        private cursol: Phaser.CursorKeys;
        private enterKey: Phaser.Key;
        private move: pt.model.Move;

        public _showFireRect: boolean;
        private _fireHitBox: Phaser.Graphics;

        constructor() {
            super(this.begin, this.init, this.update);
        }

        private init(parent: pt.object.GameObject, param: { map: pt.object.Map, speed: number }) {
            this.move = new pt.model.Move();
            this.unfirableWithNoArg = true;
        }

        private begin(parent: pt.object.GameObject, from, param: { map: pt.object.Map, speed: number, tps?: number }) {
            this.cursol = parent.game.input.keyboard.createCursorKeys();
            this.enterKey = parent.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            this.map = param.map;
            this.speed = param.speed;
            if (param.tps != null) {
                //var layer = param.map.getLayer(parent.layer);
                this.speed = 32 * param.tps;
            }
            if (!pt.manager.FocusManager.has(this)) {
                pt.manager.FocusManager.request(this);
            }
            this.setOnDone(() => {
                //pt.manager.FocusManager.remove(this); //TODO
            });
            this.move.done();
            console.log("controller begin");
        }

        private fireEventsOnMap(parent: pt.object.GameObject) {
            console.log("try to fire events");
            var rect = parent.getFireRect();
            console.log(rect);
            this.map.fireEvents(parent, rect);

            var hit = this.map.getLayer(parent.layer).collidesObject(parent.getHitRect(), parent);
            console.log("collidesObj:" + hit);

            hit = this.map.getLayer(parent.layer).collidesMap(parent.getHitRect());
            console.log("collidesMap:" + hit);
        }

        private update(parent: pt.object.GameObject) {
            if (pt.manager.FocusManager.isFocused(this)) {
                if (pt.util.isKeyDown(this.enterKey)) {
                    this.fireEventsOnMap(parent);
                }
                var to = pt.util.buildInputVector(this.cursol);
                if (to.x != 0 || to.y != 0) {
                    to.setMagnitude(8)
                        .add(parent.position.x, parent.position.y);
                    this.move.fire(parent, null, pt.model.Move.buildArg(this.map, to.x, to.y, this.speed, false, true));
                }
            }
        }
    }
}