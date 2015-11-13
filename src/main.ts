///<reference path="../phaser/typescript/phaser.d.ts"/>
class MyGameState extends Phaser.State {
    public preload():void {
        this.load.image("enemy", "img/Enemy/pipo-enemy001.png");
        this.load.image("enemy2", "img/Enemy/pipo-enemy002.png");
    }

    public create():void {
        super.create();
        //alert("here is create");
        console.log(this);
        var sample: Phaser.Sprite = this.game.add.sprite(320, 240, "enemy");
        sample.anchor.setTo(0.5, 0.5);

        var sample02: Phaser.Sprite = new Phaser.Sprite(this.game, 0, 0, "enemy2");
        sample02.anchor.setTo(0.5, 0.5);
        sample.addChild(sample02);
        sample02.position.setTo(100, 100);


    }
}

window.onload = () => {
    var game: Phaser.Game;
    game = new Phaser.Game(640, 480, Phaser.AUTO, '', new MyGameState());
}