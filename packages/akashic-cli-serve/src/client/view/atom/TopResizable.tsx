import { observer } from "mobx-react";
import * as React from "react";
import * as styles from "./TopResizable.module.css";

export interface TopResizableProps {
	height: number;
	minHeight: number;
	children?: React.ReactNode;
	onResize: (height: number) => void;
}

export const TopResizable = observer(class TopResizable extends React.Component<TopResizableProps, {}> {
	private lastPageY: number | null;

	constructor(props: TopResizableProps) {
		super(props);
		this.lastPageY = null;
	}

	render(): React.ReactNode {
		return <div className={styles["top-resizable"]} style={{ height: this.props.height }} >
			<div className={styles.content}>
				{ this.props.children }
			</div>
			<div className={styles["h-resizer"]} onMouseDown={this._onMouseDownResizer} />
		</div>;
	}

	private _onMouseDownResizer = (ev: React.MouseEvent<HTMLDivElement>): void => {
		window.addEventListener("mousemove", this._onMouseMoveWindow);
		window.addEventListener("mouseup", this._onMouseUpWindow);
		this.lastPageY = ev.nativeEvent.pageY;
	};

	private _onMouseMoveWindow = (ev: MouseEvent): void => {
		const { onResize, height, minHeight } = this.props;
		const h = Math.max(height - (ev.pageY - this.lastPageY!), minHeight);
		if (h !== height) {
			onResize(h);
			this.lastPageY = ev.pageY;
		}
	};

	private _onMouseUpWindow = (): void => {
		window.removeEventListener("mousemove", this._onMouseMoveWindow);
		window.removeEventListener("mouseup", this._onMouseUpWindow);
	};
});

