/// <reference path="main.ts"/>

module test {
    export class Test extends main.MyMain {
        constructor() {
            super("this is test class");
        }

        public say():void {
            super.say();
            super.say();
        }
    }
}