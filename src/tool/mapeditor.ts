///<reference path="../../mithril/mithril.d.ts"/>
///<reference path="mapeditorstate.ts" />
///<reference path="../test/teststate.ts" />
module pt.editor {
    const MAPEDITOR_CANVAS_ID = "editorcanvas";
    export class MapEditorController {
        private state: pt.editor.MapEditorState;
        private game: Phaser.Game;

        //props
        public path;

        constructor() {
            console.log("controller constructor");
            this.path = m.prop("こんにちは");
        }

        public run() {
            console.log("call run");
            if (this.game == null) {
                this.state = new pt.editor.MapEditorState();
                this.game = new Phaser.Game(0, 0, Phaser.AUTO, "canvasArea", this.state );
                this.state.create = () => {
                    this.state.startLoadingMap("", "untitled", () => {
                        m.redraw(true);
                    });
                }
            }
        }

        public save() {
            this.state.save();
        }
    }

    export class MapEditor {
        private ctrlInstance;
        constructor() {
        }

        public controller() {
            return new MapEditorController();
        }
        public view(ctrl: MapEditorController) {
            console.log("call view");
            return m("div", [
                m("div", { id: "canvasArea" }),
                m("span", {}, "here is mapeditor"),
                m("input", { onchange: m.withAttr("value", ctrl.path), value: ctrl.path() }),
                m("button", { onclick: ctrl.run }, "すたーと"),
                m("button", { onclick: ctrl.save }, "save")
            ]);
        }
    }
}