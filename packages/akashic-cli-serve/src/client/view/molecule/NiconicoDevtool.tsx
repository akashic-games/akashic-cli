import * as React from "react";
import * as styles from "./NiconicoDevtool.css";
import { observer } from "mobx-react";
import { FlexScrollY } from "../atom/FlexScrollY";
import { GameConfiguration } from "../../../common/types/GameConfiguration";

export interface NiconicoDevtoolProps {
	disabled: boolean;
	gameJson: GameConfiguration;
	isAutoSendEvents: boolean;
	isStopGame: boolean;
	usePreferredTimeLimit: boolean;
	useStopGameOnTimeout: boolean;
	totalTimeLimit: string;
	mode: string;
	duration: number;
	remainingTime: number;
	score?: number;
	playThreshold?: number;
	clearThreshold?: number;
	onAutoSendEventsChanged: (isSend: boolean) => void;
	onModeSelectChanged: (e: string) => void;
	onTotalTimeLimitChanged: (v: string) => void;
	onUsePreferredTotalTimeLimitChanged: (value: boolean) => void;
	onUseStopGameChanged: (value: boolean) => void;
	setRemainingTime: (v: number) => void;
	setStopGame: (v: boolean) => void;
	sendNicoEvent: (eventName: any) => void;
	stopGame: () => void;
}

@observer
export class NiconicoDevtool extends React.Component<NiconicoDevtoolProps, {}> {
	readonly defaultTotalTimeLimit = 85;
	readonly modeList = [
		{ text: "ひとりで遊ぶ(single)", value: "single" },
		{ text: "ランキング(ranking)", value: "ranking" }
	];

	private preferredTotalTimeLimit: number;
	private totalTime: number;
	private intervalId: any;

	constructor(props: NiconicoDevtoolProps) {
		super(props);
		if (props.disabled) return;

		props.setStopGame(false);
		const niconicoConfig = props.gameJson && props.gameJson.environment && props.gameJson.environment.niconico;
		this.preferredTotalTimeLimit =
			!niconicoConfig || !niconicoConfig.preferredSessionParameters || !niconicoConfig.preferredSessionParameters.totalTimeLimit
				? this.defaultTotalTimeLimit
				: niconicoConfig.preferredSessionParameters.totalTimeLimit;

		this.totalTime = props.usePreferredTimeLimit ? this.preferredTotalTimeLimit : parseInt(props.totalTimeLimit, 10);
		if (isNaN(this.totalTime)) this.totalTime = this.defaultTotalTimeLimit;
		this.props.setRemainingTime(this.totalTime);
	}

	componentDidMount(): void {
		if (this.props.isAutoSendEvents) {
			this.sendNicoEvent(this.totalTime);

			if (this.props.mode === "ranking") {
				const gameStartTime = Date.now();
				const dur = this.props.duration / 1000;
				this.totalTime = dur > this.totalTime ? 0 : this.totalTime - dur;

				this.intervalId = setInterval(() => {
					const currentRemainingTime = this.totalTime - (Date.now() - gameStartTime) / 1000;
					this.props.setRemainingTime(currentRemainingTime > 0 ? Math.ceil(currentRemainingTime) : 0);
				}, 1000 / this.props.gameJson.fps);
				this.wait(this.totalTime * 1000, () => this.stopGameOnTimeout(this.intervalId));
			}
		}
	}

	componentWillUnmount(): void {
		clearInterval(this.intervalId);
	}

	stopGameOnTimeout(intervalId: any): void {
		this.props.setRemainingTime(0);
		clearInterval(intervalId);
		if (this.props.useStopGameOnTimeout) {
			this.props.setStopGame(true);
			this.props.stopGame();
		}
	}

	wait(ms: number, callback: () => void): Promise<void> {
		return new Promise(resolve => {
			setTimeout(() => { resolve(callback()); }, ms);
		});
	}

	sendNicoEvent(totalTime: number) {
		const params: any = {
			"mode": this.props.mode
		};
		if (this.props.mode === "ranking") {
			params["totalTimeLimit"] = totalTime;
		}
		const event = [[32, 0, "dummy", {
			"type": "start",
			"parameters": params
		}]];
		this.props.sendNicoEvent(event);
	}

	render(): React.ReactNode {
		const selectOptions = this.modeList.map((mode) => {
			return <option value={mode.value} key={mode.value}>{mode.text}</option>;
		});

		return <div className={styles["niconico-devtool"]}>
			<div className={this.props.disabled ? "" : styles["hidden"]}>
				<b>起動オプションの --target-service atsumaru が指定されている場合、このタブは無効になります。</b>
			</div>

			<FlexScrollY>
				<div className={this.props.disabled ? styles["hidden"] : ""}>
					<div>
						<label><b>ニコニコ新市場対応テスト</b></label>
						<div>
							<input type="checkbox" checked={this.props.isAutoSendEvents} onChange={this._onAutoSendEventChange} />
							セッションパラメータを送る(要新規プレイ)
						</div>

						<div className={this.props.isAutoSendEvents ? "" : styles["hidden"]}>
							<table className={styles["niconico-table"]}>
								<thead>
									<tr>
										<th>property</th>
										<th>content</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>mode</td>
										<td>
											<select name="mode-select" onChange={this._onModeSelectChanged} value={this.props.mode}>
												{selectOptions}
											</select>
										</td>
									</tr>
									<tr className={this.props.mode !== "ranking" ? styles["text-silver"] : ""}>
										<td>totalTimeLimit</td>
										<td>
											<input type="text" value={this.props.totalTimeLimit}
												className={this.props.mode !== "ranking" || this.props.usePreferredTimeLimit ? styles["text-silver"] : ""}
												disabled={this.props.mode !== "ranking" || this.props.usePreferredTimeLimit}
												onChange={this._onTotalTimeLimitChanged} />
											<div>
												<label>
													<input type="checkbox"
														checked={this.props.usePreferredTimeLimit}
														disabled={this.props.mode !== "ranking"}
														onChange={this._onUsePreferredTotalTimeLimitChanged} />
													<span>game.jsonのpreferredSessionParametersの値を利用する({this.preferredTotalTimeLimit}秒)</span>
												</label>
											</div>
											<label>
												<input type="checkbox"
													checked={this.props.useStopGameOnTimeout}
													onChange={this._onUseStopGameChanged}
													disabled={this.props.mode !== "ranking"}/>
												<span>時間経過後にゲームを停止</span> (残 {this.props.remainingTime} 秒)
											</label>
											<p className={`${styles["text-red-bold"]} ${this.props.isStopGame ? styles["text-visible"] : styles["text-hidden"]}`} >
												ゲームを停止しました。</p>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<div>
						<label><b>ランキングモードで参照される値</b></label>
						<table className={styles["niconico-table"]}>
							<thead>
								<tr>
									<th>g.game.vars.gameState</th>
									<th>value</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>score</td>
									<td>{this.props.score}</td>
								</tr>
								<tr>
									<td>playThreshold</td>
									<td>{this.props.playThreshold}</td>
								</tr>
								<tr>
									<td>clearThreshold</td>
									<td>{this.props.clearThreshold}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</FlexScrollY>
		</div>;
	}

	private _onAutoSendEventChange = (): void => {
		this.props.onAutoSendEventsChanged(!this.props.isAutoSendEvents);
	}

	private _onModeSelectChanged = (e: React.ChangeEvent<HTMLSelectElement>): void => {
		this.props.onModeSelectChanged(e.target.value);
	}

	private _onUsePreferredTotalTimeLimitChanged = (): void => {
		this.props.onUsePreferredTotalTimeLimitChanged(!this.props.usePreferredTimeLimit);
	}

	private _onUseStopGameChanged = (): void => {
		this.props.onUseStopGameChanged(!this.props.useStopGameOnTimeout);
	}

	private _onTotalTimeLimitChanged = (e: React.ChangeEvent<HTMLInputElement> ): void => {
		if (e.target.value !== "" && isNaN(parseInt(e.target.value, 10))) return;
		this.props.onTotalTimeLimitChanged(e.target.value);
	}
}
