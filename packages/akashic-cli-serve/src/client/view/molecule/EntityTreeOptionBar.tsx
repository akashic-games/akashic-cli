import * as React from "react";
import { observer } from "mobx-react";
import { ToolIconButton } from "../atom/ToolIconButton";
import { ToolCheckbox } from "../atom/ToolCheckbox";
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
		const { isSelectingEntity, showsHidden, onChangeShowsHidden, onClickSelectEntity, onClickUpdateEntityTrees } = this.props;
		return <div className={styles["entity-tree-option-bar"]}>
			<ToolIconButton
				className="external-ref_button_select-entity-from-screen"
				icon="input"
				title="ゲーム画面からエンティティを選択"
				pushed={isSelectingEntity}
				size={17}
				onClick={onClickSelectEntity}
			/>
			<div className={styles["sep"]} />
			<ToolIconButton
				className="external-ref_button_refresh-entity-tree"
				icon="refresh"
				title="エンティティツリーを更新"
				size={20}
				onClick={this.props.onClickUpdateEntityTrees}
			>
				Update
			</ToolIconButton>
			<ToolCheckbox
				checked={showsHidden}
				label="Show hidden"
				onChange={onChangeShowsHidden} />
			<ToolIconButton
				className="external-ref_button_dump-to-console"
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
