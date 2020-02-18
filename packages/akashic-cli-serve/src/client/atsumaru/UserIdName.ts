// niconicoユーザーの情報(idとユーザー名のみ)
export interface UserIdName {
	id: number;
	name: string;
}

export const dummyUserIdName: UserIdName = {
	id: 9999,
	name: "ダミー"
};
