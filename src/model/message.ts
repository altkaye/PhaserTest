///<reference path="event.ts"/>
///<reference path="../sprite/panelsprite.ts" />
///<reference path="../../phaser/typescript/phaser.d.ts"/>
///<reference path="../manager/focusmanager.ts"/>
///<reference path="../sprite/messagewindow.ts"/>
module pt.model {
    export class Message extends pt.model.Event {
        private mesWindow: pt.sprite.MessageWindow;

        constructor() {
            super(this.begin, this.init, null);
        }

        private init() {
            this.unfirableWithNoArg = true;
        }

        /**
         * @param args [0] script body
         */
        private begin(from, parent: pt.object.GameObject, arg) {
            this.mesWindow = new pt.sprite.MessageWindow(parent.game, "panel");
            this.mesWindow.open(arg, true, true);

            this.mesWindow.setOnClose((f) => {
                this.done();
            });

            this.done = (b) => {
                super.done(b);
                if (this.mesWindow.IsOpened) {
                    this.mesWindow.close();
                }
            }
        }
    }
}