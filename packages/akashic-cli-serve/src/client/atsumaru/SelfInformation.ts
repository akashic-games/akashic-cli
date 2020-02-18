// アツマールAPIを利用しているユーザ自身の情報
export interface SelfInformation {
	id: number;
	name: string;
	isPremium: boolean;
	profile: string;
	twitterId: string;
	url: string;
}

export const dummySelfInfomation: SelfInformation = {
	id: 9999,
	name: "ダミー",
	isPremium: true,
	profile: "ダミーデータです",
	twitterId: "dummy_niconico",
	url: "https://game.nicovideo.jp/atsumaru/"
};
