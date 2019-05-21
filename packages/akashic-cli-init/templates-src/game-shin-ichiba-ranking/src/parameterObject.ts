export interface GameMainParameterObject extends g.GameMainParameterObject {
	sessionParameter: {
		mode?: string;
		totalTimeLimit?: number;
	};
	isAtsumaru: boolean;
}
