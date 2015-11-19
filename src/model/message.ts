///<reference path="event.ts"/>
///<reference path="../sprite/panelsprite.ts" />
///<reference path="../../phaser/typescript/phaser.d.ts"/>
///<reference path="../manager/focusmanager.ts"/>
module pt.model {
    export class Message extends pt.model.Event {
        private panel: pt.sprite.PanelSprite;
        private text: Phaser.Text;
        private pages: Array<string>;

        private game: Phaser.Game;

        constructor() {
            super(this.begin, null, this.update);
        }

        private update(parent: pt.object.GameObject) {
            if (pt.manager.FocusManager.isFocused(this)) {
                var keyDown = this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
                if (keyDown) {
                    if (!Message.nextPage(this)) {
                        this.game.world.removeChild(this.panel);
                        pt.manager.FocusManager.remove(this);
                        this.done();
                    }
                }
            }
        }

        private static nextPage(self): boolean {
            if (self.pages.length == 0) {
                return false;
            } else {
                self.text.setText(self.pages.shift());
                return true;
            }
        }

        /**
         * @param args [0] script body
         */
        private begin(from, parent: pt.object.GameObject, arg) {
            this.pages = Message.splitByP(arg);
            this.panel = new pt.sprite.PanelSprite(parent.game, 0, 0, 300, 50, "panel");
            this.panel.anchor.setTo(0.5, 0.5);
            var style = {
                font: "20px Arial",
                fill: "#ffffff",
                align: "center",
                wordWrap: true,
                wordWrapWidth: 300
            };
            this.text = new Phaser.Text(parent.game, 0, 0, this.pages.shift(), style);
            this.text.anchor.setTo(0.5, 0.5);
            this.panel.addChild(this.text);
            this.game = parent.game;
            this.game.world.addChild(this.panel);

            pt.manager.FocusManager.request(this);
        }

        private static splitByP(script: string) {
            var ret = [];
            var pages = script.split("</p>");//TODO use regex or DOMParser
            pages.forEach((str) => {
                ret.push(str.replace("<p>", ""));
            });
            return ret;
        }
    }
}