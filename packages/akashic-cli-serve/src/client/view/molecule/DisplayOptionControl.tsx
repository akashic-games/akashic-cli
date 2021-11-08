import { observer } from "mobx-react";
import * as React from "react";
import { Popover } from "../atom/Popover";
import { ToolIconButton } from "../atom/ToolIconButton";
import * as styles from "./DisplayOptionControl.css";

export interface DisplayOptionControlPropsData {
	showsDisplayOptionPopover: boolean;
	showsBackgroundImage: boolean;
	showsGrid: boolean;
	showsProfiler: boolean;
	showsDesignGuideline: boolean;
	onClickDisplayOptionPopover: (show: boolean) => void;
	onChangeShowBackgroundImage: (show: boolean) => void;
	onChangeShowGrid: (show: boolean) => void;
	onChangeShowProfiler: (show: boolean) => void;
	onChangeShowDesignGuideline: (show: boolean) => void;
}

export interface DisplayOptionControlProps {
	makeProps: () => DisplayOptionControlPropsData;
}

export const DisplayOptionControl = observer(function (props: DisplayOptionControlProps) {
	const {
		showsDisplayOptionPopover,
		showsBackgroundImage,
		showsGrid,
		showsProfiler,
		showsDesignGuideline,
		onClickDisplayOptionPopover,
		onChangeShowBackgroundImage,
		onChangeShowGrid,
		onChangeShowProfiler,
		onChangeShowDesignGuideline
	} = props.makeProps();
	const ref = React.useRef();

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
						className={styles.checkbox + " external-ref_checkbox_shows-background-image"}
						type="checkbox"
						checked={showsBackgroundImage}
						onChange={() => onChangeShowBackgroundImage(!showsBackgroundImage)}
					/>
					Show backgorund image
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
							<i className={"material-icons " + styles["help-link-icon"]}>help</i>
						</a>
					</span>
				</label>
			</div>
		</Popover>
	</div>;
});
