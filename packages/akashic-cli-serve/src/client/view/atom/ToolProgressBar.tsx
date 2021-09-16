import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "./ToolProgressBar.css";

export interface ToolProgressBarProps {
	max: number;
	value: number;
	width?: number;
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
		return (
			<div className={styles["container"]} style={{ width }} onMouseDown={this._onMouseDownGauge} >
				<div className={className} ref={this._onRef}>
					<div className={styles["bar"]} style={{ width: `${ratio * 100}%` }}>
						<div className={styles["circle"]} onMouseDown={this._onMouseDown} />
					</div>
				</div>
			</div>
		);
	}

	private _onRef = (e: HTMLDivElement): void => {
		this._ref = e;
	}

	private _onMouseDownGauge = (ev: React.MouseEvent<HTMLDivElement>): void => {
		if (!this._ref || !this.props.onChange)
			return;
		this._onMouseDown(ev);
		const v = this._valueFromPageX(ev.nativeEvent.pageX);
		if (isNaN(v))
			return;
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
		if (!this.props.onChange)
			return;
		const v = this._valueFromPageX(ev.pageX);
		if (isNaN(v))
			return;
		if (this.props.value !== v)
			this.props.onChange(v);
	}

	private _onMouseUpWindow = (ev: MouseEvent): void => {
		ev.stopPropagation();
		ev.preventDefault();
		window.removeEventListener("mousemove", this._onMouseMoveWindow);
		window.removeEventListener("mouseup", this._onMouseUpWindow);
		if (!this.props.onCommit)
			return;
		const v = this._valueFromPageX(ev.pageX);
		if (isNaN(v))
			return;
		// onChangeと異なり、値が変化していなくても通知する。さもなくばonChangeの後にonCommitが来る保証がなくなってしまう
		this.props.onCommit(v);
	}

	private _valueFromPageX(pageX: number): number {
		if (!this._ref)
			return NaN;
		const max = this.props.max;
		const { left, width } = this._ref.getBoundingClientRect();
		const offset = pageX - (window.pageXOffset + left);
		return Math.round(Math.min(1, Math.max(0, offset / width)) * max);
	}
}
