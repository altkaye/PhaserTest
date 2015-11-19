///<reference path="event.ts"/>
module pt.model {

    export class EventFlow {
        private index :number;
        private queue:Array<LinkedEvent>;

        constructor() {
            this.index = 0;
            this.queue = [];
        }

        public next(ev:pt.model.Event, parent?, from?, ...args):EventFlow {
            var lev = new LinkedEvent(ev,parent, from, args);
            this.last.setNext(lev);
            this.queue.push(lev);
            return this;
        }

        public then(func) {
            //todo
            return this;
        }

        get last:LinkedEvent {
            return this.queue[this.queue.length - 1];
        }

        public begin() {
            this.qu
            this.queue[0].fire();
            return this;
        }
    }

    class LinkedEvent {
        private event:pt.model.Event;
        private parent;
        private from;
        private args:any;
        private onDoneCache:any;

        private next:LinkedEvent;

        constructor(ev:pt.model.Event, parent, from, ...args) {
            this.event = ev;
            this.args = args;
            this.onDoneCache = ev.OnDone;
            this.parent = parent;
            this.from = from;
        }

        public setNext(e:LinkedEvent) {
            this.next = e;
        }

        public fire() {
            this.event.setOnDone(
                () => {
                    this.onDoneCache(this.event);
                    this.next.fire();
                }
            ).fire(this.parent, this.from, this.args);
        }
    }
}