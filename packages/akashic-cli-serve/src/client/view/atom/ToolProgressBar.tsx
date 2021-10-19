import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "./ToolProgressBar.css";

export interface ToolProgressBarProps {
	max: number;
	value: number;
	subValue?: number;
	markerValue?: number;
	width?: number;
	active?: boolean;
	onChange?: (val: number) => void;
	onCommit?: (val: number) => void;
}

function clamp(v: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, v));
}

@observer
export class ToolProgressBar extends React.Component<ToolProgressBarProps, {}> {
	private _ref: HTMLDivElement;

	constructor(props: ToolProgressBarProps) {
		super(props);
		this._ref = null;
	}

	render() {
		const { width, max, value, subValue, markerValue, active } = this.props;
		const ratio = clamp(value, 0, max) / max;
		const subRatio = clamp((subValue ?? 0), 0, max) / max;
		const markerRatio = (markerValue != null) ? clamp(markerValue, 0, max) / max : null;
		const className = styles["tool-progress-bar"] + (active ? ` ${styles["active"]}` : "");
		const subBar = <div className={styles["subbar"]} style={{ width: `${subRatio * 100}%` }} />;
		return (
			<div className={styles["container"]} style={{ width }} onMouseDown={this._onMouseDownGauge} >
				<div className={className} ref={this._onRef}>
					{ (subRatio > ratio) && subBar }
					<div className={styles["bar"]} style={{ width: `${ratio * 100}%` }} />
					{ (subRatio <= ratio) && subBar }
					{ (markerRatio != null) && <div className={styles["marker"]} style={{ left: `calc(${markerRatio * 100}% - 4px)` }} /> }
					<div className={styles["circle"]} style={{ left: `calc(${ratio * 100}% - 4px)` }} onMouseDown={this._onMouseDown} />
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
		return Math.round(clamp(offset / width, 0, 1) * max);
	}
}