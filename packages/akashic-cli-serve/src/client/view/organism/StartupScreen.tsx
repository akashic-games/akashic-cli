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
	joinFlag: boolean;
	onClickCopyEvent: (eventName: string) => void;
	onEventEditContentChanged: (content: string) => void;
	onChangeJoinFlag: (joinFlag: boolean) => void;
	startContent: (params?: StartContentParameterObject) => Promise<void>;
}

@observer
export class StartupScreen extends React.Component<StartupScreenProps, {}> {
	render(): React.ReactNode {
		return <div className={styles["devtool"]}>
			<div className="checkbox">
				<label className="join">
					<input type="checkbox" id="join" checked={this.props.joinFlag}
						   onChange={() => this.props.onChangeJoinFlag(!this.props.joinFlag)}/>
					このコンテンツに join する
				</label>
			</div>
			{this._generateStartArgumentDom()}
			<div className="send-button">
				<button type="button" onClick={this._handleClickSendButton}>
					コンテンツの開始
				</button>
			</div>
		</div>;
	}

	private _generateStartArgumentDom = (): React.ReactNode => {
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
						title={"イベントリストの表示・非表示を切り替え"}
						pushed={props.showsEventList}
						onClick={props.onToggleList} />
				</div>
				<textarea
					className={styles["editor"]}
					value={props.eventEditContent}
					placeholder={"an array of playlog events (JSON) to send"}
					onChange={this._handleTextAreaChange} />
			</div>
		</div>;
	}

	private _handleClickSendButton = (): void => {
		this.props.startContent({joinFlag: this.props.joinFlag, startupArgument: JSON.parse(this.props.eventEditContent)})
			.catch(e => { console.error(e); });
	}

	private _handleTextAreaChange = (ev: React.ChangeEvent<HTMLTextAreaElement>): void => {
		this.props.onEventEditContentChanged(ev.target.value);
	}
}
