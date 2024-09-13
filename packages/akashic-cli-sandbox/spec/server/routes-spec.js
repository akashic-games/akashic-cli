import App from "../../lib/app.js";
import request from "supertest";
import fs from "fs";
import path from "path";

describe("app", () => {
    describe("/js", () => {
        it("should return js file based on options", async () => {
            const jsBase = path.join(__dirname, "../fixtures/js");
            const app = App({ jsBase });
            const expectedContext = fs.readFileSync(path.join(jsBase, "script.js"), "utf-8");

            const res = await request(app)
                .get("/js/script.js")
                .expect("Content-Type", /javascript/)
                .expect(expectedContext);

            expect(res.status).toBe(200);
        });

        it("should return /js/v1/developer.js as default", async () => {
            const app = App();
            const jsBase = path.join(__dirname, "../../js/v1");
            const expectedContext = fs.readFileSync(path.join(jsBase, "developer.js"), "utf-8");

            const res = await request(app)
                .get("/js/v1/developer.js")
                .expect("Content-Type", /javascript/)
                .expect(expectedContext);

            expect(res.status).toBe(200);
        });

        it("should return /js/v2/developer.js given environment['sandbox-runtime'] = '2'", async () => {
            const gameBase = path.join(__dirname, "../fixtures/games/v2");
            const app = App({ gameBase });
            const jsBase = path.join(__dirname, "../../js/v2");
            const expectedContext = fs.readFileSync(path.join(jsBase, "developer.js"), "utf-8");

            const res = await request(app)
                .get("/js/v2/developer.js")
                .expect("Content-Type", /javascript/)
                .expect(expectedContext);

            expect(res.status).toBe(200);
        });
    });

    describe("/css", () => {
        it("should return css file based on options", async () => {
            const cssBase = path.join(__dirname, "../fixtures/css/");
            const app = App({ cssBase });
            const expectedContext = fs.readFileSync(path.join(cssBase, "style.css"), "utf-8");

            const res = await request(app)
                .get("/css/style.css")
                .expect("Content-Type", /css/)
                .expect(expectedContext);

            expect(res.status).toBe(200);
        });

        it("should return /css/developer.css as default", async () => {
            const app = App();
            const cssBase = path.join(__dirname, "../../css/");
            const expectedContext = fs.readFileSync(path.join(cssBase, "developer.css"), "utf-8");

            const res = await request(app)
                .get("/css/developer.css")
                .expect("Content-Type", /css/)
                .expect(expectedContext);

            expect(res.status).toBe(200);
        });
    });

    describe("/game/", () => {
        it("should return 200 when set non-existent gameBase path", async () => {
            const app = App({ gameBase: "/not/exist/path/" });

            const res = await request(app)
                .get("/game/")
                .expect(200);

            expect(res.status).toBe(200);
        });

        it("should return 200 when set gameBase", async () => {
            const gameBase = path.join(__dirname, "../fixtures/games/hello");
            const app = App({ gameBase });

            const res = await request(app)
                .get("/game/")
                .expect(200)
                .expect("Content-Type", /html/);

            expect(res.status).toBe(200);
        });
    });

    describe("/game/:scriptName", () => {
        it("should return 404 when not have id query", async () => {
            const app = App({ gameBase: "/not/exist/path/" });

            const res = await request(app)
                .get("/game/script/mainScene.js")
                .expect(404);

            expect(res.status).toBe(404);
        });

        it("should return 200 when have id query", async () => {
            const gameBase = path.join(__dirname, "../fixtures/games/hello");
            const app = App({ gameBase });

            const res = await request(app)
                .get("/game/script/mainScene.js?id=mainScene")
                .expect(200)
                .expect("Content-Type", /javascript/);

            expect(res.status).toBe(200);
        });
    });

    describe("/raw_game/:scriptName", () => {
        it("should return 200", async () => {
            const gameBase = path.join(__dirname, "../fixtures/games/hello");
            const app = App({ gameBase });

            const res = await request(app)
                .get("/raw_game/script/mainScene.js")
                .expect(200)
                .expect("Content-Type", /javascript/);

            expect(res.status).toBe(200);
        });
    });

    describe("/engine", () => {
        it("should return 200", async () => {
            const gameBase = path.join(__dirname, "../fixtures/games/hello");
            const app = App({ gameBase });

            const res = await request(app)
                .get("/engine")
                .expect(200)
                .expect("Content-Type", /json/);

            expect(res.status).toBe(200);
        });
    });

    describe("soundbox-runtime value is invalid", () => {
        it("should error if the value is 4", async () => {
            const gameBase = path.join(__dirname, "../fixtures/games/errRuntimeValue");
            expect(() => void App({ gameBase })).toThrowError("sandbox-runtime value is invalid. Please set the environment. sandbox-runtime value of game.json to 1, 2, or 3.");
        });
    });
});
