function main(param) {
    var scene = new g.Scene({
        game: g.game,
        assetPaths: ["/**/*"],
    });
    scene.onLoad.add(function () {
        var bg = new g.Sprite({
            scene: scene,
            src: scene.asset.getImage("/assets/virtual.png"),
            x: 0,
            y: 0
        });
        scene.append(bg);

        var image = new g.Sprite({
            scene: scene,
            src: scene.asset.getImageById("94x73_clone1"),
            x: 100,
            y: 100,
        });
        scene.append(image);

        var image2 = new g.Sprite({
            scene: scene,
            src: scene.asset.getImageById("94x73_clone1"),
            x: 200,
            y: 100,
            srcX: 20,
            srcY: 30,
            srcWidth: 50,
            srcHeight: 25
        });
        scene.append(image2);
    });
    g.game.pushScene(scene);
}
module.exports = main;
