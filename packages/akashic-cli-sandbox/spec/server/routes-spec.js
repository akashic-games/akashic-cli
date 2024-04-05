var App = require("../../lib/app");
var request = require("supertest");
var fs = require("fs");
var path = require("path");
describe("app", function () {
    describe("/js", function () {
        it("should return js file based on options", function (done) {
            var jsBase = path.join(__dirname, "../fixtures/js");
            var app = App({
                jsBase: jsBase
            });
            var expectedContext = fs.readFileSync(path.join(jsBase, "script.js"), "utf-8");
            request(app)
                .get("/js/script.js")
                .expect("Content-Type", /javascript/)
                .expect(expectedContext)
                .end(function (err, res) {
                    if (err) {
                        done.fail(err);
                    }
                    done();
                });
        });
        it("should return /js/v1/developer.js as default", function (done) {
            var app = App();
            var jsBase = path.join(__dirname, "../../js/v1");
            var expectedContext = fs.readFileSync(path.join(jsBase, "developer.js"), "utf-8");
            request(app)
                .get("/js/v1/developer.js")
                .expect("Content-Type", /javascript/)
                .expect(expectedContext)
                .end(function (err, res) {
                    if (err) {
                        done.fail(err);
                    }
                    done();
                });
        });
        it("should return /js/v2/developer.js given environment['sandbox-runtime'] = '2'", function (done) {
            var gameBase = path.join(__dirname, "../fixtures/games/v2");
            var app = App({
                gameBase: gameBase
            });
            var jsBase = path.join(__dirname, "../../js/v2");
            var expectedContext = fs.readFileSync(path.join(jsBase, "developer.js"), "utf-8");
            request(app)
                .get("/js/v2/developer.js")
                .expect("Content-Type", /javascript/)
                .expect(expectedContext)
                .end(function (err, res) {
                    if (err) {
                        done.fail(err);
                    }
                    done();
                });
        });
    });
    describe("/css", function () {
        it("should return css file based on options", function (done) {
            var cssBase = path.join(__dirname, "../fixtures/css/");
            var app = App({
                cssBase: cssBase
            });
            var expectedContext = fs.readFileSync(path.join(cssBase, "style.css"), "utf-8");
            request(app)
                .get("/css/style.css")
                .expect("Content-Type", /css/)
                .expect(expectedContext)
                .end(function (err, res) {
                    if (err) {
                        done.fail(err);
                    }
                    done();
                });
        });
        it("should reutrn /css/developer.css as default", function (done) {
            var app = App();
            var cssBase = path.join(__dirname, "../../css/");
            var expectedContext = fs.readFileSync(path.join(cssBase, "developer.css"), "utf-8");
            request(app)
                .get("/css/developer.css")
                .expect("Content-Type", /css/)
                .expect(expectedContext)
                .end(function (err, res) {
                    if (err) {
                        done.fail(err);
                    }
                    done();
                });
        })
    });
    describe("/game/", function () {
        describe("when set non-exist gameBase path", function () {
            it("should return 200", function (done) {
                var app = App({
                    gameBase: "/not/exist/path/"
                });
                request(app)
                    .get("/game/")
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            done.fail(err);
                        }
                        done();
                    })
            });
        });
        describe("when set gameBase", function () {
            it("should return 200", function (done) {
                var gameBase = path.join(__dirname, "../fixtures/games/hello");
                var app = App({gameBase: gameBase});
                request(app)
                    .get("/game/")
                    .expect(200)
                    .expect("Content-Type", /html/)
                    .end(function (err, res) {
                        if (err) {
                            done.fail(err);
                        }
                        done();
                    });
            });
        });
    });
    describe("/game/:scriptName", function () {
        describe("when not have id query", function () {
            it("should return 404", function (done) {
                var app = App({
                    gameBase: "/not/exist/path/"
                });
                request(app)
                    .get("/game/script/mainScene.js")
                    .expect(404)
                    .end(function (err, res) {
                        if (err) {
                            done.fail(err);
                        }
                        done();
                    });
            });
        });
        describe("when have id query", function () {
            it("should return 200", function (done) {
                var gameBase = path.join(__dirname, "../fixtures/games/hello");
                var app = App({gameBase: gameBase});
                request(app)
                    .get("/game/script/mainScene.js?id=mainScene")
                    .expect(200)
                    .expect("Content-Type", /javascript/)
                    .end(function (err, res) {
                        if (err) {
                            done.fail(err);
                        }
                        done();
                    });
            });
        });
    });
    describe("/raw_game/:scriptName", function () {
        it("should return 200", function (done) {
            var gameBase = path.join(__dirname, "../fixtures/games/hello");
            var app = App({gameBase: gameBase});
            request(app)
                .get("/raw_game/script/mainScene.js")
                .expect(200)
                .expect("Content-Type", /javascript/)
                .end(function (err, res) {
                    if (err) {
                        done.fail(err);
                    }
                    done();
                });
        });
    });
    describe("/engine", function () {
        it("should return 200", function (done) {
            var gameBase = path.join(__dirname, "../fixtures/games/hello");
            var app = App({gameBase: gameBase});
            request(app)
                .get("/engine")
                .expect(200)
                .expect("Content-Type", /json/)
                .end(function (err, res) {
                    if (err) {
                        done.fail(err);
                    }
                    done();
                });
        });
    });

	describe("soundbox-runtime value is invalid", function () {
		it("error occurs if the value is 4", function (done) {
			var errMsg = "";
			try {
				var gameBase = path.join(__dirname, "../fixtures/games/errRuntimeValue");
				var app = App({gameBase: gameBase});

			} catch(e) {
				errMsg = e.toString().trim();

			} finally {
				expect(errMsg).toBe("Error: sandbox-runtime value is invalid. Please set the environment. sandbox-runtime value of game.json to 1, 2, or 3.");
				done();
			}
		});
	});

});
