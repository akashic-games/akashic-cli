import * as React from "react";
import { ObservableMap } from "mobx";
import { observer } from "mobx-react";
import { EDumpItem } from "../../common/EDumpItem";
import { ToolIconButton } from "../atom/ToolIconButton";
import * as styles from "./EntityTreeDevtool.css";

export interface EntityTreeDevtoolProps {
	onClickUpdateEntityTrees: () => void;
	onClickToggleOpenEntityChildren?: (e: EDumpItem) => void;
	onClickEntityItem?: (e: EDumpItem) => void;
	entityTrees: EDumpItem[];
	entityTreeStateTable: ObservableMap<number, boolean>;
}

function toFixed(x: number, d: number = 2): string {
	return x.toFixed((Math.floor(x) === x) ? 0 : d);
}

function strigifyEDumpItemScale(e: EDumpItem): string {
	const sx = e.scaleX, sy = e.scaleY;
	return (sx === 1 && sy === 1) ? "" : (sx === sy) ? `x${toFixed(sx)}` : `(x${toFixed(sx)}, x${toFixed(sy)})`;
}

function renderEDumpItem(e: EDumpItem, props?: EntityTreeDevtoolProps): React.ReactNode {
	const toggle = (ev: React.MouseEvent<HTMLElement>) => {
		ev.stopPropagation();
		props.onClickToggleOpenEntityChildren(e);
	};
	const hasChildren = e.children && e.children.length > 0;
	const showsChildren = !props.entityTreeStateTable.get(e.id);
	const buttonStyle = styles["entity-expand-button"] + (hasChildren ? ""  : " " + styles["entity-expand-button-hidden"]);
	return <div key={e.id}>
		<div className={styles["entity-item"]} onClick={() => props.onClickEntityItem(e)}>
			<i className={"material-icons " + buttonStyle} onClick={toggle}>
				{ showsChildren ? "expand_more" : "chevron_right" }
			</i>
			<span className={styles["entity-class-name"]}>{ e.constructorName }</span>
			<span className={styles["entity-mini-info"]}>
				{ `#${e.id} (${toFixed(e.x)}, ${toFixed(e.y)}) ${toFixed(e.width)}x${toFixed(e.height)}` }
				{ `${e.angle !== 0 ? ` ${toFixed(e.angle)}°` : ""} ${strigifyEDumpItemScale(e)}` }
			</span>
		</div>
		{
			hasChildren && showsChildren
				? <div style={{ marginLeft: 10 }}>{ e.children.map(c => renderEDumpItem(c, props)) }</div>
				: null
		}
	</div>;
}

@observer
export class EntityTreeDevtool extends React.Component<EntityTreeDevtoolProps, {}> {
	render(): React.ReactNode {
		return <div className={styles["entity-tree-devtool"]}>
			<div className={styles["entity-tree-toolbar"]}>
				<ToolIconButton icon="refresh"
				                title="ツリー情報を更新"
				                onClick={this.props.onClickUpdateEntityTrees}>
					Update
				</ToolIconButton>
			</div>
			<div className={styles["entity-tree-view"]}>
				{ (this.props.entityTrees || []).map(e => renderEDumpItem(e, this.props)) }
			</div>
		</div>;
	}
}
