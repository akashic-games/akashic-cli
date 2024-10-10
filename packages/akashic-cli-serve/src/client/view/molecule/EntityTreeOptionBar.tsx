import { observer } from "mobx-react";
import * as React from "react";
import { ToolCheckbox } from "../atom/ToolCheckbox";
import { ToolIconButton } from "../atom/ToolIconButton";
import * as styles from "./EntityTreeOptionBar.module.css";

export interface EntityTreeOptionBarProps {
	isSelectingEntity: boolean;
	selectedEntityId: number | null;
	showsHidden: boolean;
	onClickDump: () => void;
	onChangeShowsHidden: (shows: boolean) => void;
	onClickSelectEntity: () => void;
	onClickUpdateEntityTrees: () => void;
}

export const EntityTreeOptionBar = observer(function EntityTreeOptionBar(props: EntityTreeOptionBarProps) {
	const {
		isSelectingEntity,
		selectedEntityId,
		showsHidden,
		onClickDump,
		onChangeShowsHidden,
		onClickSelectEntity,
		onClickUpdateEntityTrees
	} = props;
	return <div className={styles["entity-tree-option-bar"]}>
		<ToolIconButton
			className="external-ref_button_select-entity-from-screen"
			icon="input"
			title="ゲーム画面からエンティティを選択"
			pushed={isSelectingEntity}
			size={17}
			onClick={onClickSelectEntity}
		/>
		<div className={styles.sep} />
		<ToolIconButton
			className="external-ref_button_refresh-entity-tree"
			icon="refresh"
			title="エンティティツリーを更新"
			size={20}
			onClick={onClickUpdateEntityTrees}
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
			disabled={selectedEntityId == null}
			onClick={onClickDump}
		>
			console.log()
		</ToolIconButton>
	</div>;
});
