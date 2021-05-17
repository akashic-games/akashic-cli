import * as React from "react";
import { ObservableMap } from "mobx";
import { observer } from "mobx-react";
import scrollIntoView from "scroll-into-view-if-needed";
import { EDumpItem } from "../../common/types/EDumpItem";
import { FlexScrollY } from "../atom/FlexScrollY";
import { ToolIconButton } from "../atom/ToolIconButton";
import { EntityTreeOptionBar, EntityTreeOptionBarProps } from "./EntityTreeOptionBar";
import * as styles from "./EntityTreeDevtool.css";

export interface EntityTreeDevtoolProps extends EntityTreeOptionBarProps {
	entityTrees: EDumpItem[];
	entityTreeStateTable: ObservableMap<number, boolean>;
	selectedEntityId: number | null;
	onClickToggleOpenEntityChildren: (e: EDumpItem) => void;
	onClickEntityItem: (e: EDumpItem) => void;
	onMouseOverEntityItem: (e: EDumpItem) => void;
	onMouseLeaveEntityItem: (e: EDumpItem) => void;
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

function stringifyEDumpItemAnchor(e: EDumpItem): React.ReactNode {
	const ax = e.anchorX === null ? "null" : e.anchorX.toString(), ay = e.anchorY === null ? "null" : e.anchorY.toString();
	return <span>✛<abbr title="anchorX anchorY">({ax}, {ay}) </abbr></span>;
}

function stringifyEDumpItemSize(e: EDumpItem): React.ReactNode {
	return <span>□<abbr title="width height">{formatNum(e.width)}x{formatNum(e.height)}</abbr></span>;
}

function stringifyEDumpItemAngle(e: EDumpItem): React.ReactNode {
	return e.angle === 0 ? null : <span>⊾<abbr title="angle">{formatNum(e.angle)}°</abbr></span>;
}

function stringifyEDumpItemPosition(e: EDumpItem): React.ReactNode {
	return <abbr title="x y"> ({formatNum(e.x)}, {formatNum(e.y)})</abbr>;
}

function scrollRefIntoView(e: HTMLElement | null): void {
	if (e) {
		scrollIntoView(e, { scrollMode: "if-needed", block: "center", inline: "nearest" });
	}
}

function renderEDumpItem(e: EDumpItem, props: EntityTreeDevtoolProps): React.ReactNode {
	if (!props.showsHidden && !e.visible)
		return null;

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
	const isSelected = e.id === props.selectedEntityId;
	const hasChildren = e.children && e.children.length > 0;
	const showsChildren = !props.entityTreeStateTable.get(e.id);
	const buttonStyle = styles["entity-expand-button"] + (hasChildren ? ""  : " " + styles["entity-expand-button-hidden"]);
	return <div key={e.id} className={e.visible ? null : styles["invisible-entity"]} ref={isSelected ? scrollRefIntoView : null}>
		<div
			className={styles["entity-item"] + (isSelected ? " " + styles["selected"] : "")}
			onMouseOver={onMouseOver}
			onMouseLeave={onMouseLeave}
			onClick={() => props.onClickEntityItem(e)}
		>
			<i className={"material-icons " + buttonStyle} onClick={toggle}>
				{ showsChildren ? "expand_more" : "chevron_right" }
			</i>
			<span className={styles["entity-class-name"]}>
				{ e.constructorName }
			</span>
			<span className={styles["entity-mini-info"]}>
				{ e.local ? <span className={styles["entity-local"]}>Local</span> : null }
				{ `#${e.id}`}&nbsp;
				{ stringifyEDumpItemPosition(e) }&nbsp;
				{ stringifyEDumpItemSize(e) }&nbsp;
				{ stringifyEDumpItemAngle(e) }&nbsp;
				{ strigifyEDumpItemScale(e) }&nbsp;
				{ stringifyEDumpItemAnchor(e) }&nbsp;
				{ e.touchable ? <span className={styles["entity-touchable"]}>Touchable</span> : null }
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
		const props = this.props;
		return <div className={styles["entity-tree-devtool"]}>
			<EntityTreeOptionBar
				isSelectingEntity={props.isSelectingEntity}
				selectedEntityId={props.selectedEntityId}
				showsHidden={props.showsHidden}
				onClickDump={props.onClickDump}
				onChangeShowsHidden={props.onChangeShowsHidden}
				onClickSelectEntity={props.onClickSelectEntity}
				onClickUpdateEntityTrees={props.onClickUpdateEntityTrees}
			/>
			<div className={styles["entity-tree-view"]}>
				<FlexScrollY>
					{ (props.entityTrees || []).map(e => renderEDumpItem(e, props)) }
				</FlexScrollY>
			</div>
		</div>;
	}
}
