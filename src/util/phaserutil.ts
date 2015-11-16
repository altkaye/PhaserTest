///<reference path="../../phaser/typescript/phaser.d.ts"/>
module pt.util {
    /**
     * need to set same anchor
     */
    export function worldToLocal(x:number, y:number, obj:PIXI.DisplayObjectContainer):{x:number, y:number} {
        var lx = x;
        var ly = y;
        var parent = obj;
        while (parent != null && !(parent instanceof Phaser.World)) {
            lx -= parent.position.x;
            ly -= parent.position.y;
            parent = parent.parent;
        }
        return {x:lx, y:ly};
    }
}