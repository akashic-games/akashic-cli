import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "./RightResizable.css";

export interface RightResizableProps {
	width: number;
	minWidth: number;
	onResize: (width: number) => void;
}

@observer
export class RightResizable extends React.Component<RightResizableProps, {}> {
	private lastPageX: number | null;

	constructor(props: RightResizableProps) {
		super(props);
		this.lastPageX = null;
	}

	render(): React.ReactNode {
		return <div className={styles["right-resizable"]} style={{ width: this.props.width }} >
			<div className={styles["content"]} style={{ width: this.props.width }}>
				{ this.props.children }
			</div>
			<div className={styles["v-resizer"]} onMouseDown={this._onMouseDownResizer} />
		</div>;
	}

	private _onMouseDownResizer = (ev: React.MouseEvent<HTMLDivElement>): void => {
		window.addEventListener("mousemove", this._onMouseMoveWindow);
		window.addEventListener("mouseup", this._onMouseUpWindow);
		this.lastPageX = ev.nativeEvent.pageX;
	}

	private _onMouseMoveWindow = (ev: MouseEvent): void => {
		const { onResize, width, minWidth } = this.props;
		const w = Math.max(width + (ev.pageX - this.lastPageX), minWidth);
		console.log({ py: ev.pageX, sy: this.lastPageX, diff: (ev.pageX - this.lastPageX) });
		if (w !== width) {
			onResize(w);
			this.lastPageX = ev.pageX;
		}
	}

	private _onMouseUpWindow = (): void => {
		window.removeEventListener("mousemove", this._onMouseMoveWindow);
		window.removeEventListener("mouseup", this._onMouseUpWindow);
	}
}
