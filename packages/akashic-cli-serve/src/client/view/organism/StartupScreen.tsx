import * as React from "react";
import { observer } from "mobx-react";
import { ToolIconButton } from "../atom/ToolIconButton";
import { RightResizable } from "../atom/RightResizable";
import { FlexScrollY } from "../atom/FlexScrollY";
import * as styles from "./StartupScreen.css";
import { StartContentParameterObject } from "../../operator/Operator";

export interface StartupScreenProps {
	showsEventList: boolean;
	eventListWidth: number;
	eventListMinWidth: number;
	onEventListResize: (width: number) => void;
	onToggleList: (nextVal: boolean) => void;
	argumentsTable?: { [name: string]: string };
	eventEditContent: string;
	joinsAutomatically: boolean;
	onClickCopyEvent: (eventName: string) => void;
	onEventEditContentChanged: (content: string) => void;
	onChangeJoinsAutomatically: (join: boolean) => void;
	onClickStartContent: (params?: StartContentParameterObject) => Promise<void>;
}

@observer
export class StartupScreen extends React.Component<StartupScreenProps, {}> {
	render(): React.ReactNode {
		const props = this.props;
		const isValidArg = this._isValidArgument(this.props.eventEditContent);
		return <div className={styles["startup-screen"]}>
			<h2 className={styles["caption"]}>
				Select Instance Arguments
			</h2>

			<div className={styles["events-devtool"]}>
				{
					props.showsEventList &&
						<RightResizable
							width={props.eventListWidth}
							minWidth={props.eventListMinWidth}
							onResize={props.onEventListResize}
						>
							<FlexScrollY>
								<ul className={styles["event-list"]}>
									<li key="sys:empty" className={"foo"} onClick={this._handleClickEmptyArguments}>
										(empty)
									</li>
									{
										props.argumentsTable &&
											Object.keys(props.argumentsTable).map(name => (
												<li
													key={"arg:" + name}
													className={"foo"}
													onClick={() => props.onClickCopyEvent(name)}
												>
													{name}
												</li>
											))
									}
								</ul>
							</FlexScrollY>
						</RightResizable>
				}
				<div className={styles["editor-container"]}>
					<div className={styles["events-toolbar"]}>
						<ToolIconButton
							icon="list"
							title={"起動引数リストの表示・非表示を切り替え"}
							pushed={props.showsEventList}
							onClick={props.onToggleList} />
					</div>
					<textarea
						className={styles["editor"] + (isValidArg ? "" : " " + styles["editor-invalid"])}
						value={props.eventEditContent}
						placeholder={"startup argument (JSON) to send to content"}
						onChange={this._handleTextAreaChange} />
				</div>
			</div>

			<div className={styles["button-bar"]}>
				<div className={styles["start-options"]}>
					<label className="join">
						<input type="checkbox" id="join" checked={props.joinsAutomatically}
								 onChange={() => props.onChangeJoinsAutomatically(!props.joinsAutomatically)}/>
						Send JoinEvent for the player
					</label>
				</div>
				<button className={styles["start-button"]} disabled={!isValidArg} type="button" onClick={this._handleClickStartButton}>
					Start instance
				</button>
			</div>
		</div>;
	}

	private _isValidArgument(argStr: string): boolean {
		if (argStr === "")
			return true;
		try {
			JSON.parse(argStr);
			return true;
		} catch (e) {
			return false;
		}
	}

	private _generateGameArgumentDom = (): React.ReactNode => {
		const props = this.props;
		return ;
	}

	private _handleClickEmptyArguments = (): void => {
	}

	private _handleClickStartButton = (): void => {
		const argsContent = this.props.eventEditContent === "" ? "{}" : this.props.eventEditContent; // textareaに何も書かれていなければ空オブジェクト扱いとする
		this.props.onClickStartContent({joinsAutomatically: this.props.joinsAutomatically, gameArgument: JSON.parse(argsContent)});
			// .catch(e => { console.error(e); });
	}

	private _handleTextAreaChange = (ev: React.ChangeEvent<HTMLTextAreaElement>): void => {
		this.props.onEventEditContentChanged(ev.target.value);
	}
}
