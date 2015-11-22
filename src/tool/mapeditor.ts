///<reference path="../../mithril/mithril.d.ts"/>
///<reference path="mapeditorstate.ts" />
///<reference path="../test/teststate.ts" />
module pt.tool {
    const MAPEDITOR_CANVAS_ID = "editorcanvas";

    export var MapEditor = {
        controller: function() {
            this.path = m.prop("こんにちは");

            var ctrl  = this;

            this.run = function() {
                console.log("run");
                console.log(ctrl.path());
                new Phaser.Game(640, 480, Phaser.AUTO, "hogehoge", new pt.test.TestState());
            }
            /**
            this.path = m.prop("");//reference from view
            this.game = null;
            this.state = null;
            this.loadMap = function() {
                if (this.game == null) {
                    this.state = new pt.test.TestState();
                    this.game = new Phaser.Game(640, 480, Phaser.AUTO, MAPEDITOR_CANVAS_ID, this.state);
                }
            }**/
        },
        view: function(ctrl) {
            return m("div", [
                m("div", {id:"hogehoge"}),
                m("span",{},"here is mapeditor"),
                m("input", { onchange: m.withAttr("value", ctrl.path), value: ctrl.path() }),
                m("button", { onclick:ctrl.run }, "すたーと")

            ]);
            //m("div", [
                //m("input", { onchange: m.withAttr("value", ctrl.path), value: ctrl.path() }),
               // m("button", {}, "読み込み")
                //,m("canvas", { id: MAPEDITOR_CANVAS_ID })
            //]);
        }
    };
}