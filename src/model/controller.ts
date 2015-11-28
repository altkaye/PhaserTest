///<reference path="event.ts"/>
///<reference path="mapdata.ts"/>
///<reference path="move.ts"/>
///<reference path="../util/phaserutil.ts"/>
///<reference path="../manager/focusmanager.ts"/>

module pt.model {
    export class Controller extends pt.model.Event {
        private map: pt.model.MapData;
        private speed: number;
        private cursol: Phaser.CursorKeys;
        private move: pt.model.Move;

        constructor() {
            super(this.begin, this.init, this.update);
        }

        private init(parent: pt.object.GameObject, param: { map: pt.model.MapData, speed: number }) {
            this.move = new pt.model.Move();
            this.cursol = parent.game.input.keyboard.createCursorKeys();
        }

        private begin(parent, from, param: { map: pt.model.MapData, speed: number }) {
            this.map = param.map;
            this.speed = param.speed;
            pt.manager.FocusManager.request(this);
            this.setOnDone(() => {
                pt.manager.FocusManager.remove(this);
            });
            this.move.done();
            console.log("controller begin");
        }

        private update(parent: pt.object.GameObject) {
            if (this.move.HasDone && pt.manager.FocusManager.isFocused(this)) {
                var to = pt.util.buildInputVector(this.cursol);
                if (to.x != 0 || to.y != 0) {
                    to.setMagnitude(8)
                        .add(parent.position.x, parent.position.y);
                    this.move.fire(parent, null, pt.model.Move.buildArg(to.x, to.y, this.speed));
                }
            }
        }
    }
}