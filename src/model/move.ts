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
            var fps = 60;//parent.game.time.advancedTiming ? parent.game.time.fps : parent.game.time.desiredFps;
            var fixedSpeed = this.speed / fps;

            var remain = new Phaser.Point(this.to.x - parent.position.x, this.to.y - parent.position.y);
            if (remain.getMagnitude() < fixedSpeed) {
                parent.position.setTo(this.to.x, this.to.y);
                this.done(true);
            } else {
                var d = remain.setMagnitude(fixedSpeed);
                parent.position.add(d.x, d.y);
            }
        }

        /**
         * speed is pixel/sec
         */
        private begin(parent: pt.object.GameObject, from: pt.object.GameObject, arg: { to: { x: number, y: number }, speed: number, fixesForward?: boolean }) {
            this.to = new Phaser.Point(arg.to.x, arg.to.y);
            this.speed = arg.speed;
            this.fixesForward = arg.fixesForward;
            if (!this.fixesForward) {
                var direction = new Phaser.Point(this.to.x - parent.position.x, this.to.y - parent.position.y).normalize();
                parent.updateForward(direction);
            }
        }
    }
}