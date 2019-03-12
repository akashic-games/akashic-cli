import * as React from "react";
import { observer } from "mobx-react";
import { ToolIconButton } from "../atom/ToolIconButton";
import { RightResizable } from "../atom/RightResizable";
import { FlexScrollY } from "../atom/FlexScrollY";
import * as styles from "./StartupScreen.css";
import { StartContentParameterObject } from "../../operator/Operator";

export interface StartupScreenProps {
	argsListWidth: number;
	argsListMinWidth: number;
	onArgsListResize: (width: number) => void;
	argumentsTable: { [name: string]: string };
	argumentsEditContent: string;
	selectedArgumentsName: string | null;
	joinsAutomatically: boolean;
	onSelectArguments: (argName: string | null) => void;
	onArgumentsEditContentChanged: (content: string) => void;
	onChangeJoinsAutomatically: (join: boolean) => void;
	onClickStartContent: (params?: StartContentParameterObject) => Promise<void>;
}

@observer
export class StartupScreen extends React.Component<StartupScreenProps, {}> {
	render(): React.ReactNode {
		const props = this.props;
		const {
			selectedArgumentsName,
			argumentsEditContent,
			argumentsTable
		} = props;
		const isValidArg = this._isValidArgument(argumentsEditContent);
		const selectedArguments = ((selectedArgumentsName == null) ? "" : argumentsTable[selectedArgumentsName]);
		const isShowingSelected = (selectedArguments === argumentsEditContent)
		const showsEditor = selectedArgumentsName || !isShowingSelected;

		const argumentsList =
			<FlexScrollY>
				<ul className={styles["args-list"] + (showsEditor ? (" " + styles["resizable"]) : "")}>
					<li
						key={"sys:noarg"}
						className={((selectedArgumentsName == null) && isShowingSelected) ? styles["selected"] : ""}
						onClick={this._handleClickNoArguments}
					>
						&lt;No Argument&gt;
					</li>
					{
						Object.keys(argumentsTable).map(name => (
							<li
								key={"template:" + name}
								className={(name === selectedArgumentsName && isShowingSelected) ? styles["selected"] : ""}
								onClick={() => props.onSelectArguments(name)}
							>
								{name}
							</li>
						))
					}
				</ul>
			</FlexScrollY>;

		return <div className={styles["startup-screen"]}>
			<h2 className={styles["caption"]}>
				New Instance
			</h2>
			<div className={styles["args-tool"]}>
				{
					!showsEditor ? argumentsList : (
						<>
							<RightResizable
								width={props.argsListWidth}
								minWidth={props.argsListMinWidth}
								onResize={props.onArgsListResize}
							>
								{ argumentsList }
							</RightResizable>
							<div className={styles["editor-container"]}>
								<div className={styles["editor-toolbar"]}>
									<div className={styles["arguments-name"]}>
										{
											(!isValidArg) ? "(Invalid JSON)" :
											(argumentsEditContent === "") ? "(no arguments)" :
											(isShowingSelected) ? `Template "${selectedArgumentsName}"` :
											"(Custom)"
										}
									</div>
								</div>
								<textarea
									className={styles["editor"]}
									value={props.argumentsEditContent}
									placeholder={"Instance Arguments (JSON)"}
									onChange={this._handleTextAreaChange} />
							</div>
						</>
					)
				}
			</div>

			<div className={styles["button-bar"]}>
				<div className={styles["start-options"]}>
					<label className="join">
						<input type="checkbox" id="join" checked={props.joinsAutomatically}
								 onChange={() => props.onChangeJoinsAutomatically(!props.joinsAutomatically)}/>
						Send JoinEvent for the player
					</label>
				</div>
				<button
					className={styles["start-button"]}
					disabled={!isValidArg}
					onClick={this._handleClickStartButton}
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
		this.props.onSelectArguments(null);
	}

	private _handleClickStartButton = (): void => {
		const { joinsAutomatically, argumentsEditContent }= this.props;
		const gameArgument = argumentsEditContent === "" ? undefined : JSON.parse(argumentsEditContent);
		this.props.onClickStartContent({joinsAutomatically, gameArgument });
	}

	private _handleTextAreaChange = (ev: React.ChangeEvent<HTMLTextAreaElement>): void => {
		this.props.onArgumentsEditContentChanged(ev.target.value);
	}
}
