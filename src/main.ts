///<reference path="../phaser/typescript/phaser.d.ts"/>
///<reference path="state/teststate.ts" />
window.onload = () => {
    var game: Phaser.Game;
    game = new Phaser.Game(640, 480, Phaser.AUTO, '', new pt.state.TestState());
}