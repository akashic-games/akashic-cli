// niconicoユーザーの情報
export interface UserInformation {
	id: number;
	name: string;
	profile: string;
	twitterId: string;
	url: string;
}

export const dummyUserInformation: UserInformation = {
	id: 9999,
	name: "ダミー",
	profile: "ダミーデータです",
	twitterId: "dummy_niconico",
	url: "https://game.nicovideo.jp/atsumaru/"
};
