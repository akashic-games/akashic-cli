export interface GameMainParameterObject extends g.GameMainParameterObject {
	sessionParameter: {
		mode?: string;
		totalTimeLimit?: number;
		difficulty?: number;
		randomSeed?: number;
		playThreshold?: number;
		clearThreshold?: number;
	};
	isAtsumaru: boolean;
}

export interface RPGAtsumaruWindow {
	RPGAtsumaru: any;
}
