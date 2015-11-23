///<reference path="../../mithril/mithril.d.ts"/>
///<reference path="mapeditorstate.ts" />
///<reference path="../test/teststate.ts" />
module pt.tool {
    const MAPEDITOR_CANVAS_ID = "editorcanvas";
    export var MapEditor = {
        state: null,
        game: null,

        controller: function() {
            this.path = m.prop("こんにちは");

            var ctrl = this;
            if (MapEditor.game == null) {
                MapEditor.state = new pt.tool.MapEditorState();
                MapEditor.game = new Phaser.Game(640, 480, Phaser.AUTO, "hogehoge", MapEditor.state);
            }
            this.run = function() {

                MapEditor.state.startLoadingMap();
            }

            this.save = function() {
                MapEditor.state.save();
            }
        },
        view: function(ctrl) {
            return m("div", [
                m("div", { id: "hogehoge" }),
                m("span", {}, "here is mapeditor"),
                m("input", { onchange: m.withAttr("value", ctrl.path), value: ctrl.path() }),
                m("button", { onclick: ctrl.run }, "すたーと"),
                m("button", { onclick: ctrl.save }, "save")
            ]);
        }
    };
}