function main(param) {
    var scene = new g.Scene({ game: g.game });
    scene.onLoad.add(function () {
        // 以下にゲームのロジックを記述します。
        var rect = new g.FilledRect({
            scene: scene,
            cssColor: "#ff0000",
            width: 32,
            height: 32
        });
        rect.onUpdate.add(function () {
            // 以下のコードは毎フレーム実行されます。
            rect.x++;
            if (rect.x > g.game.width)
                rect.x = 0;
            rect.modified();
        });
        scene.append(rect);
    });
    g.game.pushScene(scene);
}
module.exports = main;
