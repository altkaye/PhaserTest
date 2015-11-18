///<reference path="event.ts"/>
///<reference path="../../phaser/typescript/phaser.d.ts"/>

module pt.model {
    export class MoveEvent extends pt.model.Event {
        private to:Phaser.Point;
        private speed:number;
        private fixesForward:boolean;
        private hasDone:boolean;

        private onMoveDone:(moveEvent:pt.model.MoveEvent) => void;

        constructor() {
            super(this.fire, this.create, this.update);
        }

        private create(parent:pt.object.GameObject) {
            this.hasDone = true;
        }

        private update(parent:pt.object.GameObject) {
            if (!this.hasDone) {
                var fps = parent.game.time.advancedTiming ? parent.game.time.fps : parent.game.time.desiredFps;
                var fixedSpeed = this.speed / fps;

                var remain = new Phaser.Point(this.to.x - parent.position.x, this.to.y - parent.position.y);
                if (remain.getMagnitude() <= fixedSpeed) {
                    parent.position.setTo(this.to.x, this.to.y);
                    this.hasDone = true;
                } else {
                    var d = remain.setMagnitude(this.speed);
                    parent.position.add(d.x, d.y);
                }
            }
        }

        /**
         * speed is pixel/sec
         */
        private fire(from:pt.object.GameObject, parent:pt.object.GameObject, args :{to:{x:number, y:number}, speed:number, fixesForward?:boolean, onMoveDone?:(moveEvent:pt.model.MoveEvent) => void}) {
            this.to = new Phaser.Point(args.to.x, args.to.y);
            this.speed = args.speed;
            this.fixesForward = args.fixesForward;
            this.onMoveDone = args.onMoveDone;
            this.hasDone = false;
            if (!this.fixesForward) {
                var direction = new Phaser.Point(this.to.x - parent.position.x, this.to.y - parent.position.y).normalize();
                parent.updateForward(direction);
            }

        }
    }
}