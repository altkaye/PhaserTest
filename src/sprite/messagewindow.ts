///<reference path="../../phaser/typescript/phaser.d.ts"/>
///<reference path="panelsprite.ts"/>
///<reference path="../manager/focusmanager.ts"/>
module pt.sprite {
    export class MessageWindow extends Phaser.Group {
        private panel: pt.sprite.PanelSprite;
        private text: Phaser.Text;
        private pages: Array<string>;
        private imageKey: string;

        private onClose: (self: MessageWindow) => void;

        private enterKey:Phaser.Key;

        constructor(game: Phaser.Game, key: string) {
            super(game);
            this.imageKey = key;

            this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        }

        public update() {
            if (this.enterKey.justDown) {
                this.onEnterKeyDown();
            }
        }

        private onEnterKeyDown() {
            if (pt.manager.FocusManager.isFocused(this)) {
                if (!this.nextPage()) {
                    pt.manager.FocusManager.remove(this);
                    this.close();
                }
            }
        }

        public close() {
            this.removeChild(this.panel);
            this.removeChild(this.text);

            if (this.onClose != null) {
                this.onClose(this);
            }
        }

        public setOnClose(f: (self: MessageWindow) => void) {
            this.onClose = f;
        }


        private nextPage(): boolean {
            if (this.pages.length == 0) {
                return false;
            } else {
                this.text.setText(this.pages.shift());
                return true;
            }
        }

        /**
        * @param src script body
        */
        public open(src: string, requestFocus = true) {
            this.pages = MessageWindow.splitByP(src);
            this.panel = new pt.sprite.PanelSprite(this.game, 0, 0, 300, 50, this.imageKey);
            this.panel.anchor.setTo(0.5, 0.5);
            var style = {
                font: "20px Arial",
                fill: "#ffffff",
                align: "center",
                wordWrap: true,
                wordWrapWidth: 300
            };
            this.text = new Phaser.Text(this.game, 0, 0, this.pages.shift(), style);
            this.text.anchor.setTo(0.5, 0.5);

            this.addChild(this.panel);
            this.addChild(this.text);
            if (requestFocus) {
                pt.manager.FocusManager.request(this);
            }
        }

        //TODO temp implementation
        private static splitByP(script: string) {
            var ret :Array<string>= [];
            var pages = script.split("</p>");//TODO use regex or DOMParser
            pages.forEach((str) => {
                str = str.replace("<p>", "");
                if (str.trim() !== "") {
                    ret.push(str);
                }
            });
            return ret;
        }
    }
}