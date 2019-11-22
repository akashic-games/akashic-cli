import * as React from "react";
import { observer } from "mobx-react";
import { ToolIconButton } from "../atom/ToolIconButton";
import * as styles from "./EntityTreeOptionBar.css";

export interface EntityTreeOptionBarProps {
	isSelectingEntity: boolean;
	selectedEntityId: number | null;
	showsHidden: boolean;
	onClickDump: () => void;
	onChangeShowsHidden: (shows: boolean) => void;
	onClickSelectEntity: () => void;
	onClickUpdateEntityTrees: () => void;
}

@observer
export class EntityTreeOptionBar extends React.Component<EntityTreeOptionBarProps, {}> {
	render(): React.ReactNode {
		const { isSelectingEntity, showsHidden, onClickSelectEntity, onClickUpdateEntityTrees } = this.props;
		return <div className={styles["entity-tree-option-bar"]}>
			<ToolIconButton
				icon="input"
				title="ゲーム画面からエンティティを選択"
				pushed={isSelectingEntity}
				size={17}
				onClick={onClickSelectEntity}
			/>
			<div className={styles["sep"]} />
			<ToolIconButton
				icon="refresh"
				title="エンティティツリーを更新"
				size={20}
				onClick={this.props.onClickUpdateEntityTrees}
			>
				Update
			</ToolIconButton>
			<label className={styles["switch-option"]}>
				<input type="checkbox" checked={this.props.showsHidden} onChange={this._onInputChange} />
				Show hidden
			</label>
			<ToolIconButton
				icon="web_asset"
				title="選択エンティティをコンソールにダンプ"
				size={20}
				disabled={this.props.selectedEntityId == null}
				onClick={this.props.onClickDump}
			>
				console.log()
			</ToolIconButton>
		</div>;
	}

	private _onInputChange = (): void => {
		this.props.onChangeShowsHidden(!this.props.showsHidden);
	}
}
