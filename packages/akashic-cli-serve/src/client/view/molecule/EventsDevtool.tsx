import * as React from "react";
import { observer } from "mobx-react";
import { ToolIconButton } from "../atom/ToolIconButton";
import { ToolLabelButton } from "../atom/ToolLabelButton";
import { RightResizable } from "../atom/RightResizable";
import { FlexScrollY } from "../atom/FlexScrollY";
import * as styles from "./EventsDevtool.css";

export interface EventsDevtoolProps {
	showsEventList: boolean;
	eventListWidth: number;
	eventListMinWidth: number;
	onEventListResize: (width: number) => void;
	onToggleList: (nextVal: boolean) => void;
	eventNames: string[];
	eventEditContent: string;
	onClickSendEvent: (eventName: string) => void;
	onClickCopyEvent: (eventName: string) => void;
	onClickSendEditingEvent: () => void;
	onEventEditContentChanged: (content: string) => void;
}

@observer
export class EventsDevtool extends React.Component<EventsDevtoolProps, {}> {
	render(): React.ReactNode {
		const props = this.props;
		const { onClickSendEvent, onClickCopyEvent, onClickSendEditingEvent } = props;
		return <div className={styles["events-devtool"]}>
			{
				this.props.showsEventList &&
					<RightResizable
						width={props.eventListWidth}
						minWidth={props.eventListMinWidth}
						onResize={props.onEventListResize}
					>
						<FlexScrollY>
							{/* TODO EventList として別コンポーネント化 */}
							<ul className={styles["event-list"]}>
								{
									this.props.eventNames.map(name => (
										<li key={name}>
											{name}
											<div className={styles["event-buttons"]}>
												<ToolLabelButton title="Send to the play" onClick={() => onClickSendEvent(name)}>
													Send
												</ToolLabelButton>
												<ToolLabelButton title="Copy to the editor" onClick={() => onClickCopyEvent(name)}>
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
					<div className={styles["sep"]} />
					<ToolLabelButton
						title="Send to the play"
						onClick={onClickSendEditingEvent}
					>
						Send
					</ToolLabelButton>
				</div>
				<textarea
					className={styles["editor"]}
					value={props.eventEditContent}
					placeholder={"an array of playlog events (JSON) to send"}
					onChange={this._handleTextAreaChange} />
			</div>
		</div>;
	}

	private _handleTextAreaChange = (ev: React.ChangeEvent<HTMLTextAreaElement>): void => {
		this.props.onEventEditContentChanged(ev.target.value);
	}
}
