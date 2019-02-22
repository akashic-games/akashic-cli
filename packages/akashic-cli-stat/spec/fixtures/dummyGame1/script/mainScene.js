var game = g.game;
module.exports = function() {
    var scene = new g.Scene({game: game});
    scene.loaded.handle(function() {
        // ここにゲームのコードを記述します
        // sample
        var hello = new g.FilledRect({scene: scene, cssColor: "#ff0000", width: 32, height: 32});
        scene.append(hello);
        hello.modified();
        hello.update.handle(function() {
            hello.x++;
            hello.modified();
        });
    });
    return scene;
}
