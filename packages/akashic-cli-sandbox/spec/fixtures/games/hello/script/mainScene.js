var game = g.game;
module.exports = function() {
    var scene = new g.Scene(game);
    scene.loaded.handle(function() {
        // ここにゲームのコードを記述します
        // sample
        var hello = new g.FilledRect(scene, "#ff0000", 32, 32);
        scene.append(hello);
        hello.update.handle(function() {
            hello.x++;
            hello.modified();
        });
    });
    return scene;
}