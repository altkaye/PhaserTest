///<reference path="../model/project.ts" />


module pt.editor {
    var currentContext;
    class Context {
        static get Instance(): Context {
            if (currentContext == null) {
                currentContext = new Context();
            }
            return currentContext;
        }

        private project: pt.model.ProjectData;
        
        get Project() {
            return this.project;
        }

        public newProject() {
            this.project = new pt.model.ProjectData();
            return this.project;
        }
    }
}