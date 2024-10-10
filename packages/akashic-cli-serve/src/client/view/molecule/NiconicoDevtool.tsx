import { observer } from "mobx-react";
import * as React from "react";
import { FlexScrollY } from "../atom/FlexScrollY";
import * as styles from "./NiconicoDevtool.module.css";

export interface NiconicoDevtoolProps {
	isAutoSendEvent: boolean;
	usePreferredTimeLimit: boolean;
	stopsGameOnTimeout: boolean;
	totalTimeLimitInputValue: number;
	emulatingShinichibaMode: string;
	playDuration: number;
	totalTimeLimit: number;
	preferredTotalTimeLimit: number | null;
	score?: number;
	playThreshold?: number;
	clearThreshold?: number;
	onAutoSendEventsChanged: (isSend: boolean) => void;
	onModeSelectChanged: (e: string) => void;
	onTotalTimeLimitInputValueChanged: (v: number) => void;
	onUsePreferredTotalTimeLimitChanged: (value: boolean) => void;
	onUseStopGameChanged: (value: boolean) => void;
}

export const NiconicoDevtool = observer(class NiconicoDevtool extends React.Component<NiconicoDevtoolProps, {}> {
	readonly modeList = [
		{ text: "ひとりで遊ぶ(single)", value: "single" },
		{ text: "ランキング(ranking)", value: "ranking" }
	];
	render(): React.ReactNode {
		const selectOptions = this.modeList.map((mode) => {
			return <option value={mode.value} key={mode.value}>{mode.text}</option>;
		});

		let remainingTime = this.props.totalTimeLimit - Math.floor(this.props.playDuration / 1000);
		remainingTime = Math.max(remainingTime, 0);

		return <div className={styles["niconico-devtool"]}>
			<FlexScrollY>
				<div>
					<div>
						<label><b>ニコニコ新市場対応テスト</b></label>
						<div>
							<input
								className="external-ref_checkbox_auto-send-event"
								type="checkbox"
								checked={this.props.isAutoSendEvent}
								onChange={this._onAutoSendEventChange} />
							セッションパラメータを送る(要新規プレイ)
						</div>

						<div className={this.props.isAutoSendEvent ? "" : styles.hidden}>
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
											<select name="mode-select" onChange={this._onModeSelectChanged}
												value={this.props.emulatingShinichibaMode}>
												{selectOptions}
											</select>
										</td>
									</tr>
									<tr className={this.props.emulatingShinichibaMode !== "ranking" ? styles["text-silver"] : ""}>
										<td>totalTimeLimit</td>
										<td>
											<input type="text"
												value={
													isNaN(this.props.totalTimeLimitInputValue) ? "" : this.props.totalTimeLimitInputValue
												}
												className={
													(this.props.emulatingShinichibaMode !== "ranking" || this.props.usePreferredTimeLimit
													? styles["text-silver"] : "")
													+ " external-ref_text_total-time-limit"
												}
												disabled={
													this.props.emulatingShinichibaMode !== "ranking" || this.props.usePreferredTimeLimit
												}
												onChange={this._onTotalTimeLimitInputValueChanged} />
											<div>
												<label>
													<input className="external-ref_checkbox_use-preferred-total-time-limit" type="checkbox"
														checked={this.props.usePreferredTimeLimit}
														disabled={this.props.emulatingShinichibaMode !== "ranking"}
														onChange={this._onUsePreferredTotalTimeLimitChanged} />
													<span>game.jsonのpreferredSessionParametersの値を利用する({this.props.preferredTotalTimeLimit}秒)</span> {/* eslint-disable-line max-len */}
												</label>
											</div>
											<label>
												<input className="external-ref_checkbox_stops-game-on-timeout" type="checkbox"
													checked={this.props.stopsGameOnTimeout}
													onChange={this._onStopsGameChanged}
													disabled={this.props.emulatingShinichibaMode !== "ranking"}/>
												<span>時間経過後にゲームを停止</span> (残 {isNaN(this.props.totalTimeLimit) ?  "N/A" : remainingTime} 秒)
											</label>
											<p className={`${styles["text-red-bold"]}
												${remainingTime === 0 ? styles["text-visible"] : styles["text-hidden"]}`} >
												ゲームを停止しました。
											</p>
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
		this.props.onAutoSendEventsChanged(!this.props.isAutoSendEvent);
	};

	private _onModeSelectChanged = (e: React.ChangeEvent<HTMLSelectElement>): void => {
		this.props.onModeSelectChanged(e.target.value);
	};

	private _onUsePreferredTotalTimeLimitChanged = (): void => {
		this.props.onUsePreferredTotalTimeLimitChanged(!this.props.usePreferredTimeLimit);
	};

	private _onStopsGameChanged = (): void => {
		this.props.onUseStopGameChanged(!this.props.stopsGameOnTimeout);
	};

	private _onTotalTimeLimitInputValueChanged = (e: React.ChangeEvent<HTMLInputElement> ): void => {
		const value = parseInt(e.target.value, 10);
		this.props.onTotalTimeLimitInputValueChanged(value);
	};
});

