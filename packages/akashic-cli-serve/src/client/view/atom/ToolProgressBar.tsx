import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "./ToolProgressBar.css";

export interface ToolProgressBarProps {
	width: number;
	max: number;
	value: number;
	active?: boolean;
	onChange?: (val: number) => void;
	onCommit?: (val: number) => void;
}

@observer
export class ToolProgressBar extends React.Component<ToolProgressBarProps, {}> {
	private _ref: HTMLDivElement;

	constructor(props: ToolProgressBarProps) {
		super(props);
		this._ref = null;
	}

	render() {
		const { width, max, value, active } = this.props;
		const ratio = value / max;
		const className = styles["tool-progress-bar"] + (active ? ` ${styles["active"]}` : "");
		return <div className={className} style={{ width }}
		            ref={this._onRef}
		            onMouseDown={this._onMouseDownGauge}>
			<div className={styles["bar"]} style={{ width: `${ratio * 100}%` }}>
				<div className={styles["circle"]} onMouseDown={this._onMouseDown} />
			</div>
		</div>;
	}

	private _onRef = (e: HTMLDivElement): void => {
		this._ref = e;
	}

	private _onMouseDownGauge = (ev: React.MouseEvent<HTMLDivElement>): void => {
		if (!this._ref || !this.props.onChange)
			return;
		this._onMouseDown(ev);
		const offset = ev.nativeEvent.pageX - (window.pageXOffset + this._ref.getBoundingClientRect().left);
		const v = this._valueFromOffset(offset);
		if (this.props.value !== v)
			this.props.onChange(v);
	}

	private _onMouseDown = (ev: React.MouseEvent<HTMLDivElement>): void => {
		ev.stopPropagation();
		ev.preventDefault();
		window.addEventListener("mousemove", this._onMouseMoveWindow);
		window.addEventListener("mouseup", this._onMouseUpWindow);
	}

	private _onMouseMoveWindow = (ev: MouseEvent): void => {
		ev.stopPropagation();
		ev.preventDefault();
		if (!this._ref || !this.props.onChange)
			return;
		const offset = ev.pageX - (window.pageXOffset + this._ref.getBoundingClientRect().left);
		const v = this._valueFromOffset(offset);
		if (this.props.value !== v)
			this.props.onChange(v);
	}

	private _onMouseUpWindow = (ev: MouseEvent): void => {
		ev.stopPropagation();
		ev.preventDefault();
		window.removeEventListener("mousemove", this._onMouseMoveWindow);
		window.removeEventListener("mouseup", this._onMouseUpWindow);
		if (!this._ref || !this.props.onCommit)
			return;
		const offset = ev.pageX - (window.pageXOffset + this._ref.getBoundingClientRect().left);
		const v = this._valueFromOffset(offset);
		// onChangeと異なり常に通知する。さもなくばonChangeの後にonCommitが来る保証がなくなってしまう
		this.props.onCommit(v);
	}

	private _valueFromOffset(offset: number): number {
		const { max, width } = this.props;
		return Math.round(Math.min(1, Math.max(0, offset / width)) * max);
	}
}
