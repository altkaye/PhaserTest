/// <reference path="hoge.ts"/>
/// <reference path="testclass.ts"/>
module main {
    export class MyMain {
        private message: string;
        constructor(message: string) {
            this.message = message;
        }

        public say(): void {
            alert(this.message);
        }
    }
}

var hello = new test.Test();
var hoges = new hoge.Hoge();