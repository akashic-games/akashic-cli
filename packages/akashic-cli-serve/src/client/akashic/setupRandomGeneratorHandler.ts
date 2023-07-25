
export interface RandomGeneratorHandler {
	onReset: () => void;
	onGenerate: () => void;
	onGet: () => void;
}

const wrappedTable: WeakSet<ae.RandomGeneratorLike> = new WeakSet();

function wrap(random: ae.RandomGeneratorLike, handler: RandomGeneratorHandler): void {
	if (wrappedTable.has(random)) return;
	wrappedTable.add(random);

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

export function setupRandomGeneratorHandler(game: agv.GameLike, handler: RandomGeneratorHandler): void {
	wrap(game.random, handler);
	handler.onReset();

	let random = game.random;
	Object.defineProperty(game, "random", {
		get() {
			return random;
		},
		set(r: ae.RandomGeneratorLike) {
			wrap(r, handler);
			if (random !== r) {
				handler.onReset();
			}
			random = r;
		}
	});
}
