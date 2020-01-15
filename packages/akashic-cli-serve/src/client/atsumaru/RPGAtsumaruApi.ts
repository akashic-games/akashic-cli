import { Observer, Subscription } from "rxjs";
import { ScoreboardData } from "./ScoreboardData";
import { ScreenshotModalResults } from "./ScreenshotModalResults";
import { SelfInformation, dummySelfInfomation } from "./SelfInformation";
import { TweetSettings } from "./TweetSettings";
import { UserIdName, dummyUserIdName } from "./UserIdName";
import { UserInformation, dummyUserInformation } from "./UserInformation";

export interface RPGAtsumaruApi {
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
			subscribe: (observer: Observer<any> | ((volume: number) => void)) => Subscription;
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

export const rpgAtsumaruApiMock: RPGAtsumaruApi = {
	comment: {
		verbose: false,
		changeScene: (sceneName: string) => {
			// コンパイルを通すためだけの処理
			console.log(sceneName);
		},
		resetAndChangeScene: (sceneName: string) => {
			// コンパイルを通すためだけの処理
			console.log(sceneName);
		},
		pushContextFactor: (factor: string) => {
			// コンパイルを通すためだけの処理
			console.log(factor);
		},
		pushMinorContext: () => {},
		setContext: (context: string) => {
			// コンパイルを通すためだけの処理
			console.log(context);
		}
	},
	storage: {
		getItems: () => {
			// コンパイルを通すためにダミーのセーブデータを用意
			const items = [{key: "data1", value: "hoge"}, {key: "data2", value: "fuga"}];
			return Promise.resolve().then(() => items);
		},
		setItems: (items: {key: string, value: string}[]) => {
			// コンパイルを通すためだけの処理
			console.log(items);
			return Promise.resolve();
		},
		removeItem: (key: string) => {
			// コンパイルを通すためだけの処理
			console.log(key);
			return Promise.resolve();
		}
	},
	volume: {
		getCurrentValue: () => {
			// コンパイルを通すためにダミーの音量を返す
			return 0;
		},
		changed: {
			subscribe: (observer: Observer<any> | ((volume: number) => void)): Subscription => {
				// コンパイルを通すためだけの処理
				console.log(observer);
				// コンパイルを通すためにダミーのSubscriptionを返す
				return new Subscription();
			}
		}
	},
	popups: {
		openLink: (url: string, comment?: string) => {
			// コンパイルを通すためだけの処理
			console.log(url, comment);
			return Promise.resolve();
		}
	},
	experimental: {
		// コンパイルを通すためにダミーのデータを返す
		query: {
			"param1": "hoge",
			"param2": "fuga",
			"param3": "hogehoge"
		},
		popups: {
			displayCreatorInformationModal: (niconicoUserId?: number | null) => {
				// コンパイルを通すためだけの処理
				console.log(niconicoUserId);
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
			getActiveUserCount: (minutes: number) => {
				return Promise.resolve().then(() => minutes); // ダミーの値として引数をそのまま返す
			}
		},
		scoreboards: {
			setRecord: (boardId: number, score: number) => {
				// コンパイルを通すためだけの処理
				console.log(boardId, score);
				return Promise.resolve();
			},
			display: (boardId: number) => {
				// コンパイルを通すためだけの処理
				console.log(boardId);
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
			setScreenshotHandler: (handler: () => Promise<string>) => {
				// コンパイルを通すためだけの処理
				console.log(handler);
			},
			setTweetMessage: (tweetSettings: TweetSettings | null) => {
				// コンパイルを通すためだけの処理
				console.log(tweetSettings);
			}
		}
	}
};
