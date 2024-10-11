import { observer } from "mobx-react";
import * as React from "react";
import { FlexScrollY } from "../atom/FlexScrollY";
import { RightResizable } from "../atom/RightResizable";
import { ToolIconButton } from "../atom/ToolIconButton";
import { ToolLabelButton } from "../atom/ToolLabelButton";
import styles from "./EventsDevtool.module.css";

export interface EventsDevtoolProps {
	showsEventList: boolean;
	eventListWidth: number;
	eventListMinWidth: number;
	onEventListResize: (width: number) => void;
	onClickShowEventList: (nextVal: boolean) => void;
	eventNames: string[];
	eventEditContent: string;
	onClickSendEvent: (eventName: string) => void;
	onClickCopyEvent: (eventName: string) => void;
	onClickSendEditingEvent: () => void;
	onEventEditContentChanged: (content: string) => void;
}

export const EventsDevtool = observer(class EventsDevtool extends React.Component<EventsDevtoolProps, {}> {
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
												<ToolLabelButton
													className="external-ref_button_send-event"
													title="Send to the play"
													onClick={() => onClickSendEvent(name)}>
													Send
												</ToolLabelButton>
												<ToolLabelButton
													className="external-ref_button_copy-event"
													title="Copy to the editor"
													onClick={() => onClickCopyEvent(name)}>
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
						className="external-ref_button_shows-event-list"
						icon="list"
						title={"イベントリストの表示・非表示を切り替え"}
						pushed={props.showsEventList}
						onClick={props.onClickShowEventList} />
					<div className={styles.sep} />
					<ToolLabelButton
						className="external-ref_button_send-editing-event"
						title="Send to the play"
						onClick={onClickSendEditingEvent}
					>
						Send
					</ToolLabelButton>
				</div>
				<textarea
					className={styles.editor}
					value={props.eventEditContent}
					placeholder={"an array of playlog events (JSON) to send"}
					onChange={this._handleTextAreaChange} />
			</div>
		</div>;
	}

	private _handleTextAreaChange = (ev: React.ChangeEvent<HTMLTextAreaElement>): void => {
		this.props.onEventEditContentChanged(ev.target.value);
	};
});

