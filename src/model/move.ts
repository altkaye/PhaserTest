///<reference path="event.ts"/>
///<reference path="../../phaser/typescript/phaser.d.ts"/>

module pt.model {
    export class Move extends pt.model.Event {
        private to: Phaser.Point;
        private speed: number;
        private fixesForward: boolean;

        constructor() {
            super(this.begin, null, this.update);
        }

        public static buildArg(toX:number, toY:number, speed = 64, fixesForward = false):{ to: { x: number, y: number }, speed: number, fixesForward: boolean } {
            return {
                to : {
                    x:Math.round(toX),
                    y:Math.round(toY)
                },
                speed:speed,
                fixesForward:fixesForward
            };
        }

        private update(parent: pt.object.GameObject) {
           // console.log("move update");
            var fps = 60;//parent.game.time.advancedTiming ? parent.game.time.fps : parent.game.time.desiredFps;
            var fixedSpeed = this.speed / fps;

            var remain = new Phaser.Point(this.to.x - parent.position.x, this.to.y - parent.position.y);
            if (remain.getMagnitude() < fixedSpeed) {
                console.log("move end");
                parent.position.setTo(this.to.x, this.to.y);
                this.done();
            } else {
                var d = remain.setMagnitude(fixedSpeed);
                parent.position.add(d.x, d.y);
            }
        }

        /**
         * speed is pixel/sec
         */
        private begin(from: pt.object.GameObject, parent: pt.object.GameObject, arg: { to: { x: number, y: number }, speed: number, fixesForward?: boolean }) {
            console.log("move begin");
            this.to = new Phaser.Point(arg[0].to.x, arg[0].to.y);
            this.speed = arg[0].speed;
            this.fixesForward = arg[0].fixesForward;
            if (!this.fixesForward) {
                var direction = new Phaser.Point(this.to.x - parent.position.x, this.to.y - parent.position.y).normalize();
                parent.updateForward(direction);
            }
        }
    }
}