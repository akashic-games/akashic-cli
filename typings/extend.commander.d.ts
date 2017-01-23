// commander型定義:
// https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/7de6c3dd94feaeb21f20054b9f30d5dabc5efabd/commander/commander.d.ts
// 上に示した型定義では runnningCommand が無いので定義する
// runningCommandに関するドキュメント:
// https://github.com/tj/commander.js/blob/master/History.md#131--2013-07-18
declare namespace commander {
	interface IExportedCommand {
		runningCommand?: any;
	}
}
