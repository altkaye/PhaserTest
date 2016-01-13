///<reference path="event.ts"/>
///<reference path="../../phaser/typescript/phaser.d.ts"/>

module pt.model {
    export class Move extends pt.model.Event {
        private to: Phaser.Point;
        private speed: number;
        private fixesForward: boolean;
        private collides: boolean;
        private map: pt.object.Map;

        constructor() {
            super(this.begin, this.init, this.update);
        }

        private init() {
            this.unfirableWithNoArg = true;
        }

        public static buildArg(map: pt.object.Map, toX: number, toY: number, speed = 64, fixesForward = false, collides = false): { map: pt.object.Map, to: { x: number, y: number }, speed: number, fixesForward: boolean, collides: boolean } {
            return {
                to: {
                    x: Math.round(toX),
                    y: Math.round(toY)
                },
                map: map,
                speed: speed,
                fixesForward: fixesForward,
                collides: collides
            };
        }

        private update(parent: pt.object.GameObject) {
            var fps = 60;//parent.game.time.advancedTiming ? parent.game.time.fps : parent.game.time.desiredFps;
            var fixedSpeed = this.speed / fps;
            var layer = this.map.getLayer(parent.layer);
            var remain = new Phaser.Point(this.to.x - parent.position.x, this.to.y - parent.position.y);
            if (remain.getMagnitude() < fixedSpeed) {
                var toRect = parent.getHitRect();
                toRect.x = this.to.x - toRect.width / 2;
                toRect.y = this.to.y - toRect.height / 2;

                if (!(layer.collidesMap(toRect) || layer.collidesObject(toRect, parent))) {
                    parent.position.setTo(this.to.x, this.to.y);
                    console.log("move done");
                    this.done(true);
                }
            } else {
                var d = remain.setMagnitude(fixedSpeed);

                if (this.collides) {
                    var rect = parent.getHitRect();
                    var diffed = rect.clone(diffed).offset(d.x, d.y);
                    if (layer.collidesMap(diffed) || layer.collidesObject(diffed, parent)) {
                        d = this.getMovableDiff(parent, d, layer);
                    }
                }

                parent.position.add(d.x, d.y);
            }
        }

        private getMovableDiff(parent: pt.object.GameObject, d: Phaser.Point, layer: pt.object.MapLayer) {
            var noDx = Phaser.Rectangle.clone(parent.getHitRect()).offset(0, d.y);
            if (!layer.collidesMap(noDx) && !layer.collidesObject(noDx, parent)) {
                return new Phaser.Point(0, d.y);
            }

            var noDy = Phaser.Rectangle.clone(parent.getHitRect()).offset(d.x, 0);
            if (!layer.collidesMap(noDy) && !layer.collidesObject(noDy, parent)) {
                return new Phaser.Point(d.x, 0);
            }
            //console.log("cant move");
            return new Phaser.Point(0, 0);
        }


        /**
         * speed is pixel/sec
         */
        private begin(parent: pt.object.GameObject, from: pt.object.GameObject, arg: { to: { x: number, y: number }, speed: number, map: pt.object.Map, collides?: boolean, fixesForward?: boolean }) {
            this.to = new Phaser.Point(arg.to.x, arg.to.y);
            this.speed = arg.speed;
            this.fixesForward = arg.fixesForward;
            this.collides = arg.collides;
            this.map = arg.map;

            if (!this.fixesForward) {
                var direction = new Phaser.Point(this.to.x - parent.position.x, this.to.y - parent.position.y).normalize();
                parent.updateForward(direction);
            }
        }
    }
}