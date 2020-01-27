import { Observer, Subscription } from "rxjs";
import { ScoreboardData } from "./ScoreboardData";
import { ScreenshotModalResults } from "./ScreenshotModalResults";
import { SelfInformation, dummySelfInfomation } from "./SelfInformation";
import { TweetSettings } from "./TweetSettings";
import { UserIdName, dummyUserIdName } from "./UserIdName";
import { UserInformation, dummyUserInformation } from "./UserInformation";
import { ServeGameContent } from "../akashic/ServeGameContent";
import { Trigger } from "@akashic/trigger";

export interface RPGAtsumaruApiLike {
	comment: {
		verbose: boolean;
		changeScene: (sceneName: string) => void;
		resetAndChangeScene: (sceneName: string) => void;
		pushContextFactor: (factor: string) => void;
		pushMinorContext: () => void;
		setContext: (context: string) => void;
	};
	storage: {
		getItems: () => Promise<{key: string, value: string}[]>;
		setItems: (items: {key: string, value: string}[]) => Promise<void>;
		removeItem: (key: string) => Promise<void>;
	};
	volume: {
		getCurrentValue: () => number;
		changed: {
			subscribe: (observer: Observer<number> | ((volume: number) => void)) => Subscription;
		}
	};
	popups: {
		openLink: (url: string, comment?: string) => Promise<void>;
	};
	experimental: {
		query: {[key: string]: string};
		popups: {
			displayCreatorInformationModal: (niconicoUserId?: number | null) => Promise<void>;
		};
		user: {
			getSelfInformation: () => Promise<SelfInformation>;
			getUserInformation: (userId: number) => Promise<UserInformation>;
			getRecentUsers: () => Promise<UserIdName[]>;
			getActiveUserCount: (minutes: number) => Promise<number>;
		};
		scoreboards: {
			setRecord: (boardId: number, score: number) => Promise<void>;
			display: (boardId: number) => Promise<void>;
			getRecords: (boardId: number) => Promise<ScoreboardData>;
		};
		screenshot: {
			displayModal: () => Promise<ScreenshotModalResults>;
			setScreenshotHandler: (handler: () => Promise<string>) => void;
			setTweetMessage: (tweetSettings: TweetSettings | null) => void;
		}
	};
}

export interface RPGAtsumaruApiParameter {
	targetContent: ServeGameContent;
}

export class RPGAtsumaruApi implements RPGAtsumaruApiLike {
	comment = {
		verbose: false,
		changeScene: (_sceneName: string) => {},
		resetAndChangeScene: (_sceneName: string) => {},
		pushContextFactor: (_factor: string) => {},
		pushMinorContext: () => {},
		setContext: (_context: string) => {}
	};

	storage = {
		getItems: () => {
			// コンパイルを通すためにダミーのセーブデータを用意
			const items = [{key: "data1", value: "hoge"}, {key: "data2", value: "fuga"}];
			return Promise.resolve().then(() => items);
		},
		// TODO: API本実装時に引数に付与したアンダースコアを除去する
		setItems: (_items: {key: string, value: string}[]) => {
			return Promise.resolve();
		},
		// TODO: API本実装時に引数に付与したアンダースコアを除去する
		removeItem: (_key: string) => {
			return Promise.resolve();
		}
	};

	volume = {
		getCurrentValue: () => {
			return this.targetContent.agvGameContent.getMasterVolume();
		},
		changed: {
			subscribe: (observer: Observer<number> | ((volume: number) => void)) => {
				this.volumeTrigger.add((vol: number) => {
					if (observer.hasOwnProperty("next")) {
						(observer as Observer<number>).next(vol);
					} else {
						(observer as Function)(vol);
					}
				});
				return new Subscription();
			}
		}
	};

	popups = {
		// TODO: API本実装時に引数に付与したアンダースコアを除去する
		openLink: (_url: string, _comment?: string) => {
			return Promise.resolve();
		}
	};

	experimental = {
		// コンパイルを通すためにダミーのデータを返す
		query: {
			"param1": "hoge",
			"param2": "fuga",
			"param3": "hogehoge"
		},
		popups: {
			// TODO: API本実装時に引数に付与したアンダースコアを除去する
			displayCreatorInformationModal: (_niconicoUserId?: number | null) => {
				return Promise.resolve();
			}
		},
		user: {
			getSelfInformation: () => {
				return Promise.resolve().then(() => dummySelfInfomation);
			},
			getUserInformation: (userId: number) => {
				const info = {
					...dummyUserInformation,
					id: userId
				};
				return Promise.resolve().then(() => info);
			},
			getRecentUsers: () => {
				return Promise.resolve().then(() => [dummyUserIdName]);
			},
			// ダミー情報を返すため引数の値は利用しないので、アンダースコアを付与する
			getActiveUserCount: (_minutes: number) => {
				return Promise.resolve().then(() => 1); // ダミーの値として固定値を返す
			}
		},
		scoreboards: {
			// TODO: API本実装時に引数に付与したアンダースコアを除去する
			setRecord: (_boardId: number, _score: number) => {
				return Promise.resolve();
			},
			// TODO: API本実装時に引数に付与したアンダースコアを除去する
			display: (_boardId: number) => {
				return Promise.resolve();
			},
			getRecords: (boardId: number) => {
				const dummyScoreboardData = {
					"myRecord": {
						"isNewRecord": false,
						"rank": 5,
						"score": 0
					},
					"ranking": [
						{
							"rank": 1,
							"score": 1000,
							"userName": "atsumalion",
							"userId": 123456
						},
						{
							"rank": 2,
							"score": 500,
							"userName": "atsumatiger",
							"userId": 123457
						},
						{
							"rank": 3,
							"score": 100,
							"userName": "atsumagorilla",
							"userId": 123458
						}
					],
					"myBestRecord": {
						"rank": 1,
						"score": 1000,
						"userName": "atsumalion",
						"userId": 123456
					},
					"boardId": boardId,
					"boardName": "スコアボードの名前"
				};
				return Promise.resolve().then(() => dummyScoreboardData);
			}
		},
		screenshot: {
			displayModal: () => {
				const dummyData = { tweeted: true };
				return Promise.resolve().then(() => dummyData);
			},
			// TODO: API本実装時に引数に付与したアンダースコアを除去する
			setScreenshotHandler: (_handler: () => Promise<string>) => {},
			// TODO: API本実装時に引数に付与したアンダースコアを除去する
			setTweetMessage: (_tweetSettings: TweetSettings | null) => {}
		}
	};

	volumeTrigger: Trigger<number>;
	private targetContent: ServeGameContent;

	constructor(params: RPGAtsumaruApiParameter) {
		this.targetContent = params.targetContent;
		this.volumeTrigger = new Trigger<number>();
	}
}
