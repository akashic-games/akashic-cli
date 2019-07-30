export interface GameMainParameterObject extends g.GameMainParameterObject {
	sessionParameter: {
		mode?: string;
		totalTimeLimit?: number;
		difficulty?: number;
		random?: g.RandomGenerator;
	};
	isAtsumaru: boolean;
}

export interface RPGAtsumaruWindow {
	RPGAtsumaru?: any;
}
