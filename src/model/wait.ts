
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

        public begin(f, p, ...args) {
            this.waitTime = args[0];
            this.lockInput = args[1];//TODO
            this.elapsedFrame = 0;
        }
    }
}