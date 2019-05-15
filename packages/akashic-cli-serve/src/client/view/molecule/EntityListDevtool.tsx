import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "./InstancesDevtool.css";
import { ToolIconButton } from "../atom/ToolIconButton";
import { FlexScrollY } from "../atom/FlexScrollY";

export interface EntityListDevtoolProps {
	onClickUpdateEntityList: () => void;
	entityList: string;
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
			{this.props.entityList}
		</div>;
	}
}
