///<reference path="../../phaser/typescript/phaser.d.ts"/>
///<reference path="../../js/util.d.ts"/>
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

    export function writeFile(name, content) {
        return writeToLocal(name, content);
    }

    export function downloadAsFile(fileName: string, content: string) {
        var blob = new Blob([content]);
        var url = window.URL;
        var blobURL = url.createObjectURL(blob);

        var a: any = document.createElement('a');
        a.download = fileName;
        a.href = blobURL;
        a.click();
    };

    export function collidesRect(a: Phaser.Rectangle, b: Phaser.Rectangle) {
        return !(
            ((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
        );
    }

    export function buildInputVector(cursol: Phaser.CursorKeys, out: Phaser.Point = new Phaser.Point()) {
        out.x = (cursol.right.isDown ? 1 : 0) + (cursol.left.isDown ? -1 : 0);
        out.y = (cursol.down.isDown ? 1 : 0) + (cursol.up.isDown ? -1 : 0);
        return out.normalize();
    }

    export function getRandomStr(length = 12) {
        var c = "abcdefghijklmnopqrstuvwxyz0123456789";
        var cl = c.length;
        var r = "";
        for (var i = 0; i < length; i++) {
            r += c[Math.floor(Math.random() * cl)];
        }
        return r;
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

