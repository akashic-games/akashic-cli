// RPGアツマールのスコアボードの情報
export interface ScoreboardData {
	myRecord: null | {
	  isNewRecord: boolean,
	  rank: number,
	  score: number
	};
	ranking: Array<{
	  rank: number,
	  score: number,
	  userName: string,
	  userId: number
	}>;
	myBestRecord: null | {
	  rank: number,
	  score: number,
	  userName: string,
	  userId: number
	};
	boardId: number;
	boardName: string;
}
