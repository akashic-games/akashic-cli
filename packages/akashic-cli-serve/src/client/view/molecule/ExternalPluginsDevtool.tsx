import * as React from "react";
import { observer } from "mobx-react";
import { CreateNewPlayAndSendEventsParameterObject } from "../../operator/Operator";
import * as styles from "./ExternalPluginsDevtool.css";
import { PlayTree } from "../../../common/types/PlayTree";

export interface ExternalPluginsDevtoolProps {
	childSessionContentUrl: string;
	childSessionParameters: any;
	onChangeChildSessionContentUrl: (url: string) => void;
	onChangeChildSessionParameters: (params: any) => void;
	onClickCreateChildPlay: (param: CreateNewPlayAndSendEventsParameterObject) => void;
	onClickSuspendChildPlay: (playId: string) => void;
	playTree: PlayTree[];
}

export interface ExternalPluginDevtoolStore {
	currentPlayId: string;
}

@observer
export class ExternalPluginsDevtool extends React.Component<ExternalPluginsDevtoolProps, ExternalPluginDevtoolStore> {
	constructor(props: Readonly<ExternalPluginsDevtoolProps>) {
		super(props);
		this.state = {
			currentPlayId: null
		};
	}

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
		let className = this.state.currentPlayId === playTree.playId ? styles["playtree-list-active"] : styles["playtree-list"];
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
		if (this.props.childSessionContentUrl == null || this.props.childSessionParameters == null)
			return;

		this.props.onClickCreateChildPlay({
			parentPlayId: this.state.currentPlayId,
			contentUrl: this.props.childSessionContentUrl,
			clientContentUrl: this.props.childSessionContentUrl,
			application: {
				type: "dummy",
				version: "dummy",
				url: this.props.childSessionContentUrl
			},
			sessionParameter: this.props.childSessionParameters
		});
	}

	private _onClickSuspendPlay = (): void => {
		if (this.state.currentPlayId == null)
			return;

		this.props.onClickSuspendChildPlay(this.state.currentPlayId);
	}

	private _onClickPlayTree = (playId: string): void => {
		this.setState({
			currentPlayId: playId
		});
	}

	private _handleContentUrlChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
		this.props.onChangeChildSessionContentUrl(ev.target.value);
	}

	private _handleSessionParameterChange = (ev: React.ChangeEvent<HTMLTextAreaElement>): void => {
		try {
			const sessionParameters = JSON.parse(ev.target.value);
			this.props.onChangeChildSessionParameters(sessionParameters);
		} catch (e) {
			//
		}
	}
}
