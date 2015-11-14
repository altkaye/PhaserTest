///<reference path="../phaser/typescript/phaser.d.ts"/>
///<reference path="maplayersprite.ts" />

class MyGameState extends Phaser.State {
    private cursol: Phaser.CursorKeys;

    public preload(): void {
        this.load.image("enemy", "img/Enemy/pipo-enemy001.png");
        this.load.image("enemy2", "img/Enemy/pipo-enemy002.png");
        this.load.image("tile", "img/MapChip/nekura1/m_town.png");
        this.load.spritesheet("chara", "img/CharaChip/16_hero1.png", 26, 42);
        this.game.time.advancedTiming = true;
    }

    public create(): void {
        super.create();
        this.cursol = this.game.input.keyboard.createCursorKeys();
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

        var sample3 : Phaser.Sprite = new pr.MapLayerSprite(this.game);
        this.world.addChild(sample3);

        var sample4 : Phaser.Sprite = this.game.add.sprite(100, 100, "chara");
        sample4.animations.add("down", [0, 1, 2, 1], 4, true);
        sample4.animations.play("down");
    }

    public update(): void {
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

window.onload = () => {
    var game: Phaser.Game;
    game = new Phaser.Game(640, 480, Phaser.AUTO, '', new MyGameState());
}