///<reference path="../../phaser/typescript/phaser.d.ts"/>
module pt.state {
    export class GameState extends Phaser.State {
    private cursol;

    public init(...args) {
        super.init(args);
    }

    public preload(): void {
        this.game.time.advancedTiming = true;
    }

    public create(): void {
        super.create();
        this.cursol = this.game.input.keyboard.createCursorKeys();
    }

    public update(): void {
        super.update();
        //testing camera and input
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
    public render(): void {
        this.game.debug.cameraInfo(this.game.camera, 0, 32);
        this.game.debug.text("fps:" + this.game.time.fps, 0, 16);
    }
    }
}