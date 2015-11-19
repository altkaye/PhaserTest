///<reference path="event.ts"/>
module pt.model {

    export class LinkedEvent {
        private event: pt.model.Event;
        private parent;
        private from;
        private arg: any;
        private onDoneCache: any;

        protected next: LinkedEvent;

        constructor(ev?: pt.model.Event, parent?, from?, arg?) {
            this.event = ev;
            this.arg = arg;
            if (ev != null) {
                this.onDoneCache = ev.OnDone;
            }
            this.parent = parent;
            this.from = from;
        }

        public hasNext() {
            return this.next != null;
        }

        public setNext(e: LinkedEvent) {
            this.next = e;
        }

        public fire() {
            this.event.setOnDone(
                () => {
                    if (this.onDoneCache != null) {
                        this.onDoneCache(this.event);
                    }
                    this.next.fire();
                }
            ).fire(this.parent, this.from, this.arg);
        }
    }

    class Then extends LinkedEvent {
        private func: () => void;
        constructor(func: () => void = () => { }) {
            super(null, null, null);
            this.func = func;
        }

        public fire() {
            this.func();
            if (this.next != null) {
                this.next.fire();
            }
        }
    }

    class EndIf extends LinkedEvent {
        private func: () => boolean;

        constructor(f) {
            super(null, null, null);
            this.func = f;
        }

        public fire() {
            if (this.func() && this.next != null) {
                this.next.fire();
            }
        }
    }

    export class EventFlow {
        private queue: Array<LinkedEvent>;

        constructor() {
            this.queue = [];
        }

        public next(ev: pt.model.Event, parent?, from?, arg?): EventFlow {
            var lev = new LinkedEvent(ev, parent, from, arg);
            return this.push(lev);
        }

        public push(le: LinkedEvent) {
            if (this.queue.length != 0) {
                this.last.setNext(le);
            }
            this.queue.push(le);
            return this;
        }

        public then(func: () => void) {
            var t = new Then(func);
            return this.push(t);
        }

        public endIf(func: () => boolean) {
            var ei = new EndIf(func);
            return this.push(ei);
        }

        get last(): LinkedEvent {
            return this.queue[this.queue.length - 1];
        }

        public loop() {
            this.then(() => {
                this.queue[0].fire();
            }).begin();
            return this;
        }

        public begin() {
            if (!this.last.hasNext()) {
                this.last.setNext(new Then());
            }
            this.queue[0].fire();
            return this;
        }
    }
}