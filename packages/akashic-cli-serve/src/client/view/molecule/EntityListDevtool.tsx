import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "./InstancesDevtool.css";
import { ToolIconButton } from "../atom/ToolIconButton";
import { Entity } from "../../store/DevtoolUiStore";

export interface EntityListDevtoolProps {
	onClickUpdateEntityList: () => void;
	entityList: Entity[];
}

@observer
export class EntityListDevtool extends React.Component<EntityListDevtoolProps, {}> {
	render(): React.ReactNode {
		return <div className={styles["entity-list-devtool"]}>
			<div className={styles["instance-toolbar"]}>
				エンティティツリーダンプ
				<ToolIconButton icon="refresh"
				                title="ツリー情報を取得"
				                onClick={this.props.onClickUpdateEntityList}>
					更新
				</ToolIconButton>
			</div>
			{JSON.stringify(this.props.entityList)}
		</div>;
	}
}
