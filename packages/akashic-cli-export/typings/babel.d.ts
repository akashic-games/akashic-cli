/**
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/babel-core/index.d.ts
 * babel-core の d.ts が7系に対応していないため、暫定として独自の d.ts を利用する
 */
interface Babel {
    transform(code: string, options?: TransformOptions): BabelFileResult;
    createConfigItem(value: any, options: any): any;
}

interface TransformOptions {
    presets?: any;
}

interface BabelFileResult {
    code: string;
}

declare var babel: Babel;

declare module "@babel/core" {
	export = babel
}

declare module "@babel/preset-env" {}
