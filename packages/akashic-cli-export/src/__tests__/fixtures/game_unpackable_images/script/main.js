function main(param) {
    var scene = new g.Scene({
        game: g.game,
        assetPaths: ["/**/*"],
    });
    scene.onLoad.add(function () {
        var bg = new g.Sprite({
            scene: scene,
            src: scene.asset.getImage("/image/1000x1000.png"),
            x: 0,
            y: 0
        });
        scene.append(bg);

        var image = new g.Sprite({
            scene: scene,
            src: scene.asset.getImage("/assets/1000x1000.png"),
            x: 100,
            y: 100,
            opacity: 0.5,
            angle: 10
        });
        scene.append(image);
    });
    g.game.pushScene(scene);
}
module.exports = main;
