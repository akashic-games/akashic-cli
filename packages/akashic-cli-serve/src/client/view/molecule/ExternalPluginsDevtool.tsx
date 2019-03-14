import * as React from "react";
import { observer } from "mobx-react";
import { CreateNewPlayAndSendEventsParameterObject } from "../../operator/Operator";
import * as styles from "./ExternalPluginsDevtool.css";
import { PlayTree } from "../../../common/types/PlayTree";

export interface ExternalPluginsDevtoolProps {
	onClickCreateChildPlay: (param: CreateNewPlayAndSendEventsParameterObject) => void;
	onClickSuspendChildPlay: (playId: string) => void;
	playTree: PlayTree[];
}

export interface ExternalPluginDevtoolStore {
	contentUrl: string;
	sessionParameters: any;
	currentPlayId: string;
}

@observer
export class ExternalPluginsDevtool extends React.Component<ExternalPluginsDevtoolProps, ExternalPluginDevtoolStore> {
	constructor(props: Readonly<ExternalPluginsDevtoolProps>) {
		super(props);
		this.state = {
			contentUrl: "",
			sessionParameters: null,
			currentPlayId: null
		};
	}

	render(): React.ReactNode {
		return <div className={styles["events-devtool"]}>
			<div className={styles["editor-container"]}>
				<input
					className={styles["editor-content-url"]}
					defaultValue={this.state.contentUrl}
					onChange={this._handleContentUrlChange}
					placeholder="content url"
				/>
				<textarea
					className={styles["editor-session-parameters"]}
					defaultValue={this.state.sessionParameters}
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
		if (this.state.contentUrl == null || this.state.sessionParameters == null)
			return;

		this.props.onClickCreateChildPlay({
			parentPlayId: this.state.currentPlayId,
			contentUrl: this.state.contentUrl,
			clientContentUrl: this.state.contentUrl,
			application: {
				type: "dummy",
				version: "dummy",
				url: this.state.contentUrl
			},
			sessionParameter: this.state.sessionParameters
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
		this.setState({
			contentUrl: ev.target.value
		});
	}

	private _handleSessionParameterChange = (ev: React.ChangeEvent<HTMLTextAreaElement>): void => {
		try {
			const sessionParameters = JSON.parse(ev.target.value);
			this.setState({
				sessionParameters
			});
		} catch (e) {
			this.setState({
				sessionParameters: null
			});
		}
	}
}
