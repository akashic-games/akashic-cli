
// npm.d.tsを補完する型定義
declare module NPM {
    export interface Config {
        del(setting: string): void;
    }
    export interface CommandFunction {
        (args: string[], silent: boolean, callback: CommandCallback): void;
    }
}
