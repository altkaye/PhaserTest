
///<reference path="event.ts"/>

module pt.model {
    export class Wait extends pt.model.Event {
        private elapsedFrame: number;
        private waitTime: number;
        private lockInput:boolean;

        constructor() {
            super(this.begin, null, this.update);
        }

        public update() {
            this.elapsedFrame += 1;//TODO
            if (this.waitTime <= this.elapsedFrame / 60) {
                this.done(true);
            }
        }

        public begin(p, f, arg) {
            this.waitTime = arg;
            this.lockInput = false;//TODO
            this.elapsedFrame = 0;
        }
    }
}