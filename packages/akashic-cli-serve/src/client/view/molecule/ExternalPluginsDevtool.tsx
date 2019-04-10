import * as React from "react";
import { observer } from "mobx-react";
import { PlayTree } from "../../../common/types/PlayTree";
import { CreateNewPlayAndSendEventsParameterObject } from "../../operator/Operator";
import * as styles from "./ExternalPluginsDevtool.css";

export interface ExternalPluginsDevtoolProps {
	childSessionContentUrl: string;
	childSessionParameters: string;
	currentPlayId: string | null;
	onChangeChildSessionContentUrl: (url: string) => void;
	onChangeChildSessionParameters: (params: any) => void;
	onChangeCurrentPlayId: (playId: string | null) => void;
	onClickCreateChildPlay: (param: CreateNewPlayAndSendEventsParameterObject) => void;
	onClickSuspendChildPlay: (playId: string) => void;
	playTree: PlayTree[];
}

@observer
export class ExternalPluginsDevtool extends React.Component<ExternalPluginsDevtoolProps, {}> {
	render(): React.ReactNode {
		return <div className={styles["external-plugin-devtool"]}>
			<div className={styles["editor-container"]}>
				<input
					className={styles["editor-content-url"]}
					defaultValue={this.props.childSessionContentUrl}
					onChange={this._handleContentUrlChange}
					placeholder="content url"
				/>
				<textarea
					className={styles["editor-session-parameters"]}
					defaultValue={this.props.childSessionParameters}
					onChange={this._handleSessionParameterChange}
					placeholder="session parameters"
				/>
			</div>
			<div className={styles["playtree-list-container"]}>
				{
					this.props.playTree.map(playTree => this.renderPlayTree(playTree))
				}
			</div>
			<input type="button" onClick={this._onClickCreateNewPlay} value="new play" />
			<input type="button" onClick={this._onClickSuspendPlay} value="suspend play" />
		</div>;
	}

	private renderPlayTree(playTree: PlayTree): React.ReactNode {
		let className = this.props.currentPlayId === playTree.playId ? styles["playtree-list-active"] : styles["playtree-list"];
		return <ul style={{marginLeft: 20, boxSizing: "content-box"}} key={playTree.playId}>
			<li className={className} key={playTree.playId} onClick={() => this._onClickPlayTree(playTree.playId)}>playId: {playTree.playId}</li>
			{
				playTree.children.length > 0
					? playTree.children.map(child => this.renderPlayTree(child))
					: null
			}
		</ul>;
	}

	private _onClickCreateNewPlay = (): void => {
		if (this.props.childSessionContentUrl == null)
			return;

		let sessionParameters: any;
		try {
			sessionParameters = JSON.parse(this.props.childSessionParameters);
		} catch (e) {
			console.error(e);
		}

		if (sessionParameters == null)
			return;

		this.props.onClickCreateChildPlay({
			parentPlayId: this.props.currentPlayId,
			contentUrl: this.props.childSessionContentUrl,
			clientContentUrl: this.props.childSessionContentUrl,
			application: {
				type: "dummy",
				version: "dummy",
				url: this.props.childSessionContentUrl
			},
			sessionParameters
		});
	}

	private _onClickSuspendPlay = (): void => {
		if (this.props.currentPlayId == null)
			return;

		this.props.onClickSuspendChildPlay(this.props.currentPlayId);
	}

	private _onClickPlayTree = (playId: string): void => {
		this.props.onChangeCurrentPlayId(playId);
	}

	private _handleContentUrlChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
		this.props.onChangeChildSessionContentUrl(ev.target.value);
	}

	private _handleSessionParameterChange = (ev: React.ChangeEvent<HTMLTextAreaElement>): void => {
		this.props.onChangeChildSessionParameters(ev.target.value);
	}
}
