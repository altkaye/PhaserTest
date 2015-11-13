///<reference path="../phaser/typescript/phaser.d.ts"/>
class MyGameState extends Phaser.State {
    private cursol: Phaser.CursorKeys;

    public preload(): void {
        this.load.image("enemy", "img/Enemy/pipo-enemy001.png");
        this.load.image("enemy2", "img/Enemy/pipo-enemy002.png");
    }

    public create(): void {
        super.create();
        //alert("here is create");
        this.world.setBounds(0, 0, 1920, 1080);
        console.log(this);
        //testing objects and nest
        var sample: Phaser.Sprite = this.game.add.sprite(320, 240, "enemy");
        sample.anchor.setTo(0.5, 0.5);

        var sample02: Phaser.Sprite = new Phaser.Sprite(this.game, 0, 0, "enemy2");
        sample02.anchor.setTo(0.5, 0.5);
        sample.addChild(sample02);
        sample02.position.setTo(100, 100);

        this.cursol = this.game.input.keyboard.createCursorKeys();
    }

    public update(): void {
        //testing camera and input
        if (this.cursol.up.isDown) {
            this.game.camera.y -= 1;
        } else if (this.cursol.down.isDown) {
            this.game.camera.y += 1;
        }
        if (this.cursol.left.isDown) {
            this.game.camera.x -= 1;
        } else if (this.cursol.right.isDown) {
            this.game.camera.x += 1;
        }
    }
    public render(): void {
        this.game.debug.cameraInfo(this.game.camera, 0, 32);
    }
}

window.onload = () => {
    var game: Phaser.Game;
    game = new Phaser.Game(640, 480, Phaser.AUTO, '', new MyGameState());
}