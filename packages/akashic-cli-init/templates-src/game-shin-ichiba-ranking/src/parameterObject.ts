export interface GameMainParameterObject extends g.GameMainParameterObject {
	sessionParameter: {
		mode?: string;
		totalTimeLimit?: number;
		difficulty?: number;
	};
	isAtsumaru: boolean;
	random: g.RandomGenerator;
}

export interface RPGAtsumaruWindow {
	RPGAtsumaru?: any;
}
