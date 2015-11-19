module pt.manager {
    /**
     * manages which object should take input.
     */
    export class FocusManager {
        private static stack:Array<any> = [];

        public static request(o:any) {
            this.remove(o);
            return this.stack.push(o);
        }

        public static remove(o:any) {
            var i = this.stack.indexOf(o);
            if (i >= 0) {
                return this.stack.splice(i, 1);
            } else {
                return o;
            }
        }

        public static isFocused(o:any) {
            return this.stack.indexOf(o) >= 0 && this.stack.indexOf(o) == this.stack.length - 1;
        }
    }
}