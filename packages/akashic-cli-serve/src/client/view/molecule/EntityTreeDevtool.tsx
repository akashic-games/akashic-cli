import * as React from "react";
import { ObservableMap } from "mobx";
import { observer } from "mobx-react";
import { EDumpItem } from "../../akashic/EDumpItem";
import { FlexScrollY } from "../atom/FlexScrollY";
import { ToolIconButton } from "../atom/ToolIconButton";
import * as styles from "./EntityTreeDevtool.css";

export interface EntityTreeDevtoolProps {
	onClickUpdateEntityTrees: () => void;
	onClickToggleOpenEntityChildren: (e: EDumpItem) => void;
	onClickEntityItem?: (e: EDumpItem) => void;
	onMouseOverEntityItem?: (e: EDumpItem) => void;
	onMouseLeaveEntityItem?: (e: EDumpItem) => void;
	entityTrees: EDumpItem[];
	entityTreeStateTable: ObservableMap<number, boolean>;
}

function formatNum(x: number, d: number = 2): string {
	return x.toFixed((Math.floor(x) === x) ? 0 : d);
}

function formatText(s: string, maxLen: number = 20): string {
	return JSON.stringify((s.length > maxLen) ? s.slice(0, maxLen) + "..." : s);
}

function strigifyEDumpItemScale(e: EDumpItem): string {
	const sx = e.scaleX, sy = e.scaleY;
	return (sx === 1 && sy === 1) ? "" : (sx === sy) ? `x${formatNum(sx)}` : `(x${formatNum(sx)}, x${formatNum(sy)})`;
}


function renderEDumpItem(e: EDumpItem, props: EntityTreeDevtoolProps): React.ReactNode {
	const toggle = (ev: React.MouseEvent<HTMLElement>) => {
		ev.stopPropagation();
		props.onClickToggleOpenEntityChildren(e);
	};
	const onMouseOver = (ev: React.MouseEvent<HTMLElement>) => {
		ev.stopPropagation();
		props.onMouseOverEntityItem(e);
	};
	const onMouseLeave = (ev: React.MouseEvent<HTMLElement>) => {
		ev.stopPropagation();
		props.onMouseLeaveEntityItem(e);
	};
	const hasChildren = e.children && e.children.length > 0;
	const showsChildren = !props.entityTreeStateTable.get(e.id);
	const buttonStyle = styles["entity-expand-button"] + (hasChildren ? ""  : " " + styles["entity-expand-button-hidden"]);
	return <div key={e.id} className={e.visible ? null : styles["invisible-entity"]}>
		<div
			className={styles["entity-item"]}
			onMouseOver={onMouseOver}
			onMouseLeave={onMouseLeave}
			onClick={() => props.onClickEntityItem(e)}
		>
			<i className={"material-icons " + buttonStyle} onClick={toggle}>
				{ showsChildren ? "expand_more" : "chevron_right" }
			</i>
			<span className={styles["entity-class-name"]}>{ e.constructorName }</span>
			<span className={styles["entity-mini-info"]}>
				{ `#${e.id} (${formatNum(e.x)}, ${formatNum(e.y)}) ${formatNum(e.width)}x${formatNum(e.height)}` }
				{ `${e.angle !== 0 ? ` ${formatNum(e.angle)}°` : ""} ${strigifyEDumpItemScale(e)}` }
				{ e.touchable ? <i className={"material-icons " + styles["entity-touch-icon"]} title={"touchable"}>touch_app</i> : null }
				{ (e.text != null) ? <span className={styles["entity-text"]}>{formatText(e.text)}</span> : null }
			</span>
			{
				e.cssColor ?
					<div
						className={styles["color-box"]}
						style={{ backgroundColor: e.cssColor, opacity: e.opacity }}
						title={`${e.cssColor} α:${formatNum(e.opacity)}`}
					/> :
					null
			}
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
				<FlexScrollY>
					{ (this.props.entityTrees || []).map(e => renderEDumpItem(e, this.props)) }
				</FlexScrollY>
			</div>
		</div>;
	}
}
