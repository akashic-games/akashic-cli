export interface GameInstanceEntity {
	stop(): Promise<void>;
	pause(): Promise<void>;
	resume(): Promise<void>;
}
