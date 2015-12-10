///<reference path="../../phaser/typescript/phaser.d.ts"/>
///<reference path="../model/mapdata.ts"/>
///<reference path="../object/map.ts"/>

module pt.state {
    export class GameState extends Phaser.State {
        private cursol;
        private map: pt.object.Map;


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

        protected setMap(data: pt.model.MapData) {
            if (this.map != null) {
                this.world.removeChild(this.map);
                this.map.destroy(true);//TODO check this
            }

            this.map = new pt.object.Map(this.game, data);
            this.world.addChild(this.map);
            this.world.setBounds(0, 0, this.map.Width, this.map.Height);
        }

        public update(): void {
            super.update();
            //testing camera and input
            /**
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
            **/
        }
        public render(): void {
            this.game.debug.cameraInfo(this.game.camera, 0, 32);
            this.game.debug.text("fps:" + this.game.time.fps, 0, 16);
        }
    }
}