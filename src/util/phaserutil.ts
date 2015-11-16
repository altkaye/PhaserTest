///<reference path="../../phaser/typescript/phaser.d.ts"/>
module pt.util {
    /**
     * need to set same anchor
     */
    export function worldToLocal(x: number, y: number, obj: PIXI.DisplayObjectContainer): { x: number, y: number } {
        var lx = x;
        var ly = y;
        var parent = obj;
        while (parent != null && !(parent instanceof Phaser.World)) {
            lx -= parent.position.x;
            ly -= parent.position.y;
            parent = parent.parent;
        }
        return { x: lx, y: ly };
    }
}

module pt.util.Point {
    export const ZERO = new Phaser.Point(0, 0);
    export const LEFT = new Phaser.Point(-1, 0);
    export const RIGHT = new Phaser.Point(1, 0);
    export const DOWN = new Phaser.Point(0, 1);
    export const UP = new Phaser.Point(0, -1);
    export const UPLEFT = new Phaser.Point(-1, -1).normalize();
    export const UPRIGHT = new Phaser.Point(1, -1).normalize();
    export const DOWNLEFT = new Phaser.Point(-1, 1).normalize();
    export const DOWNRIGHT = new Phaser.Point(1, 1).normalize();
}