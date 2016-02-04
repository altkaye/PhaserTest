///<reference path="event.ts"/>
///<reference path="../sprite/panelsprite.ts" />
///<reference path="../../phaser/typescript/phaser.d.ts"/>
///<reference path="../manager/focusmanager.ts"/>
///<reference path="../sprite/messagewindow.ts"/>
///<reference path="./message.ts" />

module pt.model {
    export class Conversation extends pt.model.Message {
        /**
         * @param args [0] script body
         */
        protected begin(parent: pt.object.GameObject, from: pt.object.GameObject, arg = "") {
            super.begin(parent, from, arg);

            if (from) {
                var prevForward = parent.forward.clone(prevForward);
                var prevOnDone = this.onDone;
                console.log("--conv--");
                console.log(parent);
                console.log(from);

                parent.updateForward(new Phaser.Point(
                   from.position.x - parent.position.x, from.position.y - parent.position.y
                ));


                this.setOnDone((self) => {
                    if (prevOnDone) {
                        prevOnDone(self);
                    }
                    console.log("fix forward");
                    parent.updateForward(prevForward);
                });
            } else {
                console.log("no from");
            }
        }
    }
}