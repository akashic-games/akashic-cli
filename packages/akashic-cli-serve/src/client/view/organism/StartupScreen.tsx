import { observer } from "mobx-react";
import * as React from "react";
import { FlexScrollY } from "../atom/FlexScrollY";
import { RightResizable } from "../atom/RightResizable";
import * as styles from "./StartupScreen.module.css";

export interface StartupScreenProps {
	listWidth: number;
	listMinWidth: number;
	onListResize: (width: number) => void;
	argumentsTable: { [name: string]: string };
	argumentEditContent: string;
	selectedArgumentName: string | null;
	joinsAutomatically: boolean;
	onSelectArgument: (argName: string | null) => void;
	onArgumentsEditContentChanged: (content: string) => void;
	onChangeJoinsAutomatically: (join: boolean) => void;
	onClickStart: () => void;
}

export const StartupScreen = observer(class StartupScreen extends React.Component<StartupScreenProps, {}> {
	render(): React.ReactNode {
		const {
			listWidth,
			listMinWidth,
			onListResize,
			selectedArgumentName,
			argumentEditContent,
			argumentsTable,
			joinsAutomatically,
			onSelectArgument,
			onChangeJoinsAutomatically,
			onClickStart
		} = this.props;
		const isValidArg = this._isValidArgument(argumentEditContent);
		const selectedArg = ((selectedArgumentName == null) ? "" : argumentsTable[selectedArgumentName]);
		const isShowingSelected = (selectedArg === argumentEditContent);
		const showsEditor = selectedArgumentName || !isShowingSelected;

		const argumentsList =
			<FlexScrollY>
				<ul className={styles["args-list"] + (showsEditor ? (" " + styles.resizable) : "")}>
					<li
						key={"sys:noarg"}
						className={((selectedArgumentName == null) && isShowingSelected) ? styles.selected : ""}
						onClick={this._handleClickNoArguments}
					>
						(No Arguments)
					</li>
					{
						Object.keys(argumentsTable).map(name => (
							<li
								key={"template:" + name}
								className={(name === selectedArgumentName && isShowingSelected) ? styles.selected : ""}
								onClick={() => onSelectArgument(name)}
							>
								{name}
							</li>
						))
					}
				</ul>
			</FlexScrollY>;

		return <div className={styles["startup-screen"]}>
			<h2 className={styles.caption}>
				New Instance
			</h2>
			<div className={styles["args-tool"]}>
				{
					!showsEditor ? argumentsList : (
						<>
							<RightResizable width={listWidth} minWidth={listMinWidth} onResize={onListResize}>
								{ argumentsList }
							</RightResizable>
							<div className={styles["editor-container"]}>
								<div className={styles["editor-toolbar"]}>
									<div className={styles["arguments-name"]}>
										{
											(!isValidArg) ? "(Invalid JSON)" :
											(argumentEditContent === "") ? "(No Arguments)" :
											(isShowingSelected) ? `Template "${selectedArgumentName}"` :
											"(Custom)"
										}
									</div>
								</div>
								<textarea
									className={styles.editor}
									value={argumentEditContent}
									placeholder={"Instance Arguments (JSON)"}
									onChange={this._handleTextAreaChange} />
							</div>
						</>
					)
				}
			</div>
			<div className={styles["button-bar"]}>
				<div className={styles["start-options"]}>
					<label>
						<input
							className="external-ref_checkbox_joins-automatically"
							type="checkbox"
							checked={joinsAutomatically}
							onChange={() => onChangeJoinsAutomatically(!joinsAutomatically)}/>
						Send JoinEvent for the player
					</label>
				</div>
				<button
					className={styles["start-button"] + " external-ref_button_start-content"}
					disabled={!isValidArg} onClick={onClickStart}
				>
					Start
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

	private _handleClickNoArguments = (): void => {
		this.props.onSelectArgument(null);
	};

	private _handleTextAreaChange = (ev: React.ChangeEvent<HTMLTextAreaElement>): void => {
		this.props.onArgumentsEditContentChanged(ev.target.value);
	};
});

