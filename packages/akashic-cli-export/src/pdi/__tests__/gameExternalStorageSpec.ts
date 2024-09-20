// TODO: このテストは将来的には外部で実行するようにする
import type * as types from "../storage/content-storage-types/index.js";
import { GameExternalStorage } from "../storage/GameExternalStorage.js";

// NOTE: 簡易 KVS 実装
class KVS {
	data: {[key: string]: any} = {};

	getItem(key: string): any | null {
		return this.data[key] || null;
	}

	setItem(key: string, value: any): void {
		this.data[key] = value;
	}
}

function promisize(storage: GameExternalStorage): any  {
	return {
		read: (req: types.GameExternalStorageReadRequest) =>
			new Promise((res, rej) => storage.read(req, (e, r) => e ? rej(e) : res(r))),
		write: (req: types.GameExternalStorageWriteRequest) =>
			new Promise((res, rej) => storage.write(req, (e, r) => e ? rej(e) : res(r)))
	};
}

describe("gameStorageSpec", () => {
	it("basic", async () => {
		const kvs = new KVS();
		const storage = new GameExternalStorage({
			kvs,
			playId: "testPlayId",
			gameCode: "dummyGameCode"
		});

		const { read, write } = promisize(storage);

		const writeResponse1 = await write(
			{
				key: "highScore",
				type: "ordered-number",
				data: [
					{
						playerId: "foo",
						value: 100
					},
					{
						playerId: "bar",
						value: 20
					},
					{
						playerId: "hoge",
						value: 50
					},
					{
						playerId: "fuga",
						value: -10
					}
				]
			}
		);
		expect(writeResponse1).toBeNull();

		expect(await read(
			{
				key: "highScore",
				type: "ordered-number",
				order: "desc",
				limit: 2,
				offset: 1
			}
		)).toEqual(
			{
				data: [
					{
						playerId: "hoge",
						value: 50
					},
					{
						playerId: "bar",
						value: 20
					}
				],
				gameCode: undefined,
				key: "highScore",
				type: "ordered-number",
				playScope: undefined
			}
		);

		expect(await read(
			{
				key: "highScore",
				type: "ordered-number",
				order: "asc",
				limit: 100,
				offset: 0
			}
		)).toEqual(
			{
				data: [
					{
						playerId: "fuga",
						value: -10
					},
					{
						playerId: "bar",
						value: 20
					},
					{
						playerId: "hoge",
						value: 50
					},
					{
						playerId: "foo",
						value: 100
					}
				],
				gameCode: undefined,
				key: "highScore",
				type: "ordered-number",
				playScope: undefined
			}
		);

		const writeResponse2 = await write(
			{
				key: "userData",
				type: "general",
				data: [
					{
						playerId: "foo",
						value: { property: 1 }
					},
					{
						playerId: "bar",
						value: { property: 2 }
					},
					{
						playerId: "hoge",
						value: { property: 3 }
					},
					{
						playerId: "fuga",
						value: { property: 4 }
					}
				]
			}
		);
		expect(writeResponse2).toBeNull();

		expect(await read(
			{
				key: "userData",
				type: "general",
				playerIds: ["hoge", "foo"]
			}
		)).toEqual(
			{
				data: [
					{
						playerId: "hoge",
						value: { property: 3 }
					},
					{
						playerId: "foo",
						value: { property: 1 }
					}
				],
				gameCode: undefined,
				key: "userData",
				type: "general",
				playScope: undefined
			}
		);

		expect(await read(
			{
				key: "item/portion",
				type: "number",
				limit: 100,
				order: "asc"
			}
		)).toEqual(
			{
				data: [],
				gameCode: undefined,
				key: "item/portion",
				type: "number",
				playScope: undefined
			}
		);

		expect(await read(
			{
				key: "item/portion",
				type: "number",
				limit: 100,
				order: "asc"
			}
		)).toEqual(
			{
				data: [],
				gameCode: undefined,
				key: "item/portion",
				type: "number",
				playScope: undefined
			}
		);
	});

	it("min/max; normal", async () => {
		const kvs = new KVS();
		const storage = new GameExternalStorage({
			kvs,
			playId: "testPlayId",
			gameCode: "dummyGameCode"
		});
		const { read, write } = promisize(storage);

		// 予め初期値を書き込み
		const writeRes1 = await write(
			{
				key: "item/portion",
				type: "number",
				data: [
					{
						playerId: "foo",
						value: 0
					},
					{
						playerId: "bar",
						value: 0
					}
				]
			}
		);
		expect(writeRes1).toBeNull();

		const result1 = await read(
			{
				key: "item/portion",
				type: "number",
				limit: 100,
				order: "asc"
			}
		);
		expect(result1).toEqual(
			{
				data: [
					{
						playerId: "foo",
						value: 0
					},
					{
						playerId: "bar",
						value: 0
					}
				],
				gameCode: undefined,
				key: "item/portion",
				type: "number",
				playScope: undefined
			}
		);

		const writeRes2 = await write(
			{
				key: "item/portion",
				type: "number",
				data: [
					{
						playerId: "foo",
						value: 5
					},
					{
						playerId: "bar",
						value: 20
					}
				],
				writeType: "incr"
			}
		);
		expect(writeRes2).toBeNull();

		const result2 = await read(
			{
				key: "item/portion",
				type: "number",
				limit: 100,
				order: "asc"
			}
		);
		expect(result2).toEqual(
			{
				data: [
					{
						playerId: "foo",
						value: 5
					},
					{
						playerId: "bar",
						value: 20
					}
				],
				gameCode: undefined,
				key: "item/portion",
				type: "number",
				playScope: undefined
			}
		);

		const writeRes3 = await write(
			{
				key: "item/portion",
				type: "number",
				data: [
					{
						playerId: "foo",
						value: 10
					},
					{
						playerId: "bar",
						value: 10
					}
				],
				writeType: "incr"
			}
		);
		expect(writeRes3).toBeNull();

		const result3 = await read(
			{
				key: "item/portion",
				type: "number",
				limit: 100,
				order: "asc"
			}
		);
		expect(result3).toEqual(
			{
				data: [
					{
						playerId: "foo",
						value: 15
					},
					{
						playerId: "bar",
						value: 30
					}
				],
				gameCode: undefined,
				key: "item/portion",
				type: "number",
				playScope: undefined
			}
		);
	});

	it("min/max; abnormal", async () => {
		const kvs = new KVS();
		const storage = new GameExternalStorage({
			kvs,
			playId: "testPlayId",
			gameCode: "dummyGameCode"
		});
		const { read, write } = promisize(storage);

		const writeRes1 = await write(
			{
				key: "item/portion",
				type: "number",
				data: [
					{
						playerId: "foo",
						value: 5
					},
					{
						playerId: "bar",
						value: 20
					}
				]
			}
		);
		expect(writeRes1).toBeNull();

		const writeRes2 = await write(
			{
				key: "item/portion",
				type: "number",
				data: [
					{
						playerId: "foo",
						value: 5
					},
					{
						playerId: "bar",
						value: 1000
					}
				],
				writeType: "incr",
				min: 0,
				max: 99
			}
		);
		expect(writeRes2).toEqual(
			{
				failed: [
					{
						gameCode: undefined,
						playScope: undefined,
						key: "item/portion",
						playerId: "bar",
						type: "number",
						failureType: "exceedMax",
						message: "exceedMax (message T.B.D)"
					}
				]
			}
		);

		const result2 = await read(
			{
				key: "item/portion",
				type: "number",
				limit: 100,
				order: "desc"
			}
		);
		expect(result2).toEqual(
			{
				data: [
					{
						playerId: "bar",
						value: 20 // incr した結果 (20 + 1000) が max (99) を超えていたら反映されない
					},
					{
						playerId: "foo",
						value: 10 // incr した結果 (5 + 5) が max (99) を超えていなければ反映される
					}
				],
				gameCode: undefined,
				key: "item/portion",
				type: "number",
				playScope: undefined
			}
		);

		const writeRes3 = await write(
			{
				key: "item/portion",
				type: "number",
				data: [
					{
						playerId: "foo",
						value: 100
					},
					{
						playerId: "bar",
						value: 5
					}
				],
				writeType: "decr",
				min: 0,
				max: 99
			}
		);
		expect(writeRes3).toEqual(
			{
				failed: [
					{
						gameCode: undefined,
						playScope: undefined,
						key: "item/portion",
						playerId: "foo",
						type: "number",
						failureType: "subceedMin",
						message: "subceedMin (message T.B.D)"
					}
				]
			}
		);

		const result3 = await read(
			{
				key: "item/portion",
				type: "number",
				limit: 100,
				order: "desc"
			}
		);
		expect(result3).toEqual(
			{
				data: [
					{
						playerId: "bar",
						value: 15 // decr した結果 (20 - 5) が min (0) を下回っていなければ反映される
					},
					{
						playerId: "foo",
						value: 10 // decr した結果 (10 - 100) が min (0) を下回っていたら反映されない
					}
				],
				gameCode: undefined,
				key: "item/portion",
				type: "number",
				playScope: undefined
			}
		);
	});
});
