import { TelemeretryRandomAction, TelemetryMessage } from "./types/TelemetryMessage";

// g.game.random の型。v1 では定義が違う (配列だった) ため、全メソッドがオプショナルである点に注意。
interface RandomGeneratorLike {
	get?(min: number, max: number): number;
	generate?(): number;
	0?: RandomGeneratorLike; // akashic-engine@1.12.3 以前との互換性のために <3.0.0 の間存在した値
}

interface RandomGeneratorHandler {
	onReset: () => void;
	onGenerate: () => void;
	onGet: () => void;
}

export interface GameLike {
	age: number;
	_idx: number;
	random: RandomGeneratorLike | RandomGeneratorLike[];
	tick(advanceAge: boolean): void;
}

const wrappedTable: WeakSet<RandomGeneratorLike> = new WeakSet();

function wrap(random: RandomGeneratorLike, handler: RandomGeneratorHandler): void {
	if (wrappedTable.has(random)) return;
	wrappedTable.add(random);

	if (random[0] && random[0] !== random) {
		wrap(random[0], handler);
	}

	if (random.generate) {
		random.generate = new Proxy(random.generate, {
			apply: function (target, thisValue, args) {
				handler.onGenerate();
				return target.apply(thisValue, args as any);
			}
		});
	}

	if (random.get) {
		random.get = new Proxy(random.get, {
			apply: function (target, thisValue, args) {
				handler.onGet();
				return target.apply(thisValue, args as any);
			}
		});
	}
}

function setupRandomGeneratorHandler(game: GameLike, handler: RandomGeneratorHandler): void {
	// v1 系の古いバージョンでは配列のこともあるが、キャストしてしまう。
	// 現実的には配列の場合には [0] しか利用されていないし、v2 当時の互換性対応でこの実装は [0] を扱えるようにしているため。
	let random = game.random as RandomGeneratorLike;

	wrap(random, handler);
	handler.onReset();

	Object.defineProperty(game, "random", {
		get() {
			return random;
		},
		set(r: RandomGeneratorLike) {
			if (random === r) return;
			if (r) {
				wrap(r, handler);
			}
			handler.onReset();
			random = r;
		}
	});
}

function assert(pred: boolean, msg: string): void {
	if (!pred)
		throw new Error(msg);
}

export function setupTelemetryHandler(game: GameLike, handler: (m: TelemetryMessage) => void): void {
	// game (engineFiles 由来の値) の型は本来静的に確定できず、将来的に GameLike に合致する保証はない。
	// 変更時の追従漏れを軽減するため、ここでできるだけ確認しておく。
	assert(typeof game.age === "number", "setupTelemetryHandler: wrong game type: age");
	assert(typeof game._idx === "number", "setupTelemetryHandler: wrong game type: _idx");
	assert(typeof game.tick === "function", "setupTelemetryHandler: wrong game type: tick");
	assert(
		Array.isArray(game.random) ?
			typeof game.random[0].get === "function" :
			typeof game.random.generate === "function",
		"setupTelemetryHandler: wrong game type: random"
	);

	let randomActions: TelemeretryRandomAction[] = [];
	
	setupRandomGeneratorHandler(game, {
		onReset(): void {
			// Reset の重複は無害なので無視
			if (randomActions.length > 0 && randomActions[randomActions.length - 1] === TelemeretryRandomAction.Reset)
				return;
			randomActions.push(TelemeretryRandomAction.Reset);
		},
		onGenerate(): void {
			randomActions.push(TelemeretryRandomAction.Generate);
		},
		onGet(): void {
			randomActions.push(TelemeretryRandomAction.Get);
		}
	});

	const tickOriginal = game.tick;
	game.tick = function (advanceAge: boolean) {
		const ret = tickOriginal.apply(this, arguments as any); // tick の具体的な型に最小限しか依存しないために型が合わないので any キャスト

		if (advanceAge) {
			const actions = randomActions;
			if (actions.length > 0)
				randomActions = [];
			const { age, _idx: idx } = game;
			handler({ age, actions: (actions.length > 0) ? actions : null, idx });
		}
		return ret;
	};
}
