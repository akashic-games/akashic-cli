import * as React from "react";
import { observer } from "mobx-react";
import { ToolIconButton } from "../atom/ToolIconButton";
import { ToolLabelButton } from "../atom/ToolLabelButton";
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
	eventNames: string[];
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
		return <div className={styles["devtool"]}>
			<div className="checkbox">
				<label className="join">
					<input type="checkbox" id="join" checked={this.props.joinsAutomatically}
						   onChange={() => this.props.onChangeJoinsAutomatically(!this.props.joinsAutomatically)}/>
					このコンテンツに join する
				</label>
			</div>
			{this._generateStartupArgumentDom()}
			<div className="send-button">
				<button type="button" onClick={this._handleClickSendButton}>
					コンテンツの開始
				</button>
			</div>
		</div>;
	}

	private _generateStartupArgumentDom = (): React.ReactNode => {
		const props = this.props;
		return <div className={styles["events-devtool"]}>
			{
				props.showsEventList &&
				<RightResizable
					width={props.eventListWidth}
					minWidth={props.eventListMinWidth}
					onResize={props.onEventListResize}
				>
					<FlexScrollY>
						{/* TODO EventList として別コンポーネント化 */}
						<ul className={styles["event-list"]}>
							{
								props.eventNames.map(name => (
									<li key={name}>
										{name}
										<div className={styles["event-buttons"]}>
											<ToolLabelButton title="Copy to the editor" onClick={() => props.onClickCopyEvent(name)}>
												Copy
											</ToolLabelButton>
										</div>
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
					className={styles["editor"]}
					value={props.eventEditContent}
					placeholder={"startup argument (JSON) to send to content"}
					onChange={this._handleTextAreaChange} />
			</div>
		</div>;
	}

	private _handleClickSendButton = (): void => {
		const argsContent = this.props.eventEditContent === "" ? "{}" : this.props.eventEditContent; // textareaに何も書かれていなければ空オブジェクト扱いとする
		this.props.onClickStartContent({joinsAutomatically: this.props.joinsAutomatically, startupArgument: JSON.parse(argsContent)})
			.catch(e => { console.error(e); });
	}

	private _handleTextAreaChange = (ev: React.ChangeEvent<HTMLTextAreaElement>): void => {
		this.props.onEventEditContentChanged(ev.target.value);
	}
}
