import { observer } from "mobx-react";
import * as React from "react";
import { Popover } from "../atom/Popover";
import { ToolIconButton } from "../atom/ToolIconButton";
import styles from "./DisplayOptionControl.module.css";

export interface DisplayOptionControlPropsData {
	showsDisplayOptionPopover: boolean;
	fitsToScreen: boolean;
	showsBackgroundImage: boolean;
	showsBackgroundColor: boolean;
	showsGrid: boolean;
	showsProfiler: boolean;
	showsDesignGuideline: boolean;
	onClickDisplayOptionPopover: (show: boolean) => void;
	onChangeFitsToScreen: (fits: boolean) => void;
	onChangeShowBackgroundImage: (show: boolean) => void;
	onChangeShowBackgroundColor: (show: boolean) => void;
	onChangeShowGrid: (show: boolean) => void;
	onChangeShowProfiler: (show: boolean) => void;
	onChangeShowDesignGuideline: (show: boolean) => void;
	onClickScreenshot: () => void;
}

export interface DisplayOptionControlProps {
	makeProps: () => DisplayOptionControlPropsData;
}

export const DisplayOptionControl = observer(function (props: DisplayOptionControlProps) {
	const {
		showsDisplayOptionPopover,
		fitsToScreen,
		showsBackgroundImage,
		showsBackgroundColor,
		showsGrid,
		showsProfiler,
		showsDesignGuideline,
		onClickDisplayOptionPopover,
		onChangeFitsToScreen,
		onChangeShowBackgroundImage,
		onChangeShowBackgroundColor,
		onChangeShowGrid,
		onChangeShowProfiler,
		onChangeShowDesignGuideline,
		onClickScreenshot
	} = props.makeProps();
	const ref = React.useRef() as React.MutableRefObject<HTMLInputElement>;

	return <div ref={ref} style={{position: "relative"}}>
		<ToolIconButton
			className="external-ref_button_display-option"
			icon="image"
			title={"表示オプション"}
			pushed={showsDisplayOptionPopover}
			onClick={onClickDisplayOptionPopover} />
		<Popover
			className={styles.popover}
			shows={showsDisplayOptionPopover}
			caption={"Display Options"}
			onChangeShows={onClickDisplayOptionPopover}
			outsideRef={ref}
		>
			<div className={styles.label}>
				<label>
					<input
						className={styles.checkbox + " external-ref_checkbox_fits-to-screen"}
						type="checkbox"
						checked={fitsToScreen}
						onChange={() => onChangeFitsToScreen(!fitsToScreen)}
					/>
					Fit to screen
				</label>
			</div>
			<div className={styles.label}>
				<label>
					<input
						className={styles.checkbox + " external-ref_checkbox_shows-background-image"}
						type="checkbox"
						checked={showsBackgroundImage}
						onChange={() => onChangeShowBackgroundImage(!showsBackgroundImage)}
					/>
					Show background image
				</label>
			</div>
			<div className={styles.label}>
				<label>
					<input
						className={styles.checkbox + " external-ref_checkbox_shows-background-color"}
						type="checkbox"
						checked={showsBackgroundColor}
						onChange={() => onChangeShowBackgroundColor(!showsBackgroundColor)}
					/>
					Show background color
				</label>
			</div>
			<div className={styles.label}>
				<label>
					<input
						className={styles.checkbox + " external-ref_checkbox_shows-grid"}
						type="checkbox"
						checked={showsGrid}
						onChange={() => onChangeShowGrid(!showsGrid)}
					/>
					Show grid
				</label>
			</div>
			<div className={styles.label}>
				<label>
					<input
						className={styles.checkbox + " external-ref_checkbox_shows-profiler"}
						type="checkbox"
						checked={showsProfiler}
						onChange={() => onChangeShowProfiler(!showsProfiler)}
					/>
					Show profiler
				</label>
			</div>
			<div className={styles.label}>
				<label>
					<span className={styles["design-guideline"]}>
						<input
							className={styles.checkbox + " external-ref_checkbox_shows-design-guideline"}
							type="checkbox"
							checked={showsDesignGuideline}
							onChange={() => onChangeShowDesignGuideline(!showsDesignGuideline)}
						/>
						Show Design Guidelines
						<a href="https://akashic-games.github.io/shin-ichiba/design-guidelines.html" target="_blank" rel="noreferrer">
							<i className={"material-icons " + styles.icon}>help</i>
						</a>
					</span>
				</label>
			</div>
			<div className={styles["button-container"]}>
				<button className={styles.button} onClick={onClickScreenshot}>
					<i className={"material-icons " + styles.icon}>monitor</i>
					Save screenshot
				</button>
			</div>
		</Popover>
	</div>;
});
