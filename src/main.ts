///<reference path="../phaser/typescript/phaser.d.ts"/>
///<reference path="object/map.ts" />
///<reference path="model/mapdata.ts" />
///<reference path="sprite/charactersprite.ts" />
///<reference path="sprite/panelsprite.ts" />
///<reference path="util/phaserutil.ts" />

class MyGameState extends Phaser.State {
    private cursol: Phaser.CursorKeys;

    public preload(): void {
        this.load.image("enemy", "img/Enemy/pipo-enemy001.png");
        this.load.image("enemy2", "img/Enemy/pipo-enemy002.png");
        this.load.image("m_town", "img/MapChip/nekura1/m_town.png");
        this.load.image("chara", "img/CharaChip/16_hero1.png");
        this.load.image("panel", "img/Panel/pipo-WindowBase006.png")
        this.game.time.advancedTiming = true;
    }

    public create(): void {
        super.create();


        this.cursol = this.game.input.keyboard.createCursorKeys();
        //alert("here is create");
        this.world.setBounds(0, 0, 1920, 1080);
        var m = pt.model.buildSampleMapData();
       // console.log(m);
       // console.log(m.Chipsets);

        var map = new pt.object.Map(this.game, pt.model.buildSampleMapData());
        this.world.addChild(map);
        map.position.setTo(map.Center.x, map.Center.y);

        //testing objects and nest
        var sample: Phaser.Sprite = this.game.add.sprite(320, 240, "enemy");
        sample.anchor.setTo(0.5, 0.5);

        var sample02: Phaser.Sprite = new Phaser.Sprite(this.game, 0, 0, "enemy2");
        sample02.anchor.setTo(0.5, 0.5);
        sample.addChild(sample02);
        sample02.position.setTo(100, 100);
        var sample4 : Phaser.Sprite = new pt.sprite.CharacterSprite(this.game, 50, 50, "chara");
        this.world.addChild(sample4)
        sample4.animations.play(pt.sprite.CharacterSprite.ANIM_UPLEFT);

        var panel :Phaser.Sprite = new pt.sprite.PanelSprite(this.game, 300, 300, 100, 60, "panel");
        sample.addChild(panel);
        panel.anchor.setTo(0.5, 0.5);
        panel.inputEnabled = true;
        panel.events.onInputDown.add((s, p) => {
            var pointer:Phaser.Pointer = p;
            console.log(s);
            //sample.removeChild(panel);
            console.log(pt.util.worldToLocal(pointer.worldX, pointer.worldY, panel));
            panel.worldPosition.set(pointer.worldX, pointer.worldY);
        });
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