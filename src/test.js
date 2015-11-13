(function () {
    alert("hello");
    console.log("hello");
    var domId = '';
    var game = new Phaser.Game(640, 480, Phaser.AUTO, domId, {
        preload: function () {
            console.log("on preload");
        },
        create: function () {
            console.log("on create");
        },
        update: function () {

        }
    });
})();