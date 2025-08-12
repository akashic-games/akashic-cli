import { observer } from "mobx-react";
import * as React from "react";
import { ToolIconButton } from "../atom/ToolIconButton";
import styles from "./ToolDropdownButton.module.css";

export interface ToolDropdownItem {
	label: string;
	tooltip?: string;
	onClick: () => void;
}

export interface ToolDropdownButtonProps {
	title: string;
	className?: string;
	items: ToolDropdownItem[];
}

export const ToolDropdownButton = observer(function ToolDropdownButton(props: ToolDropdownButtonProps): JSX.Element {
	const { title, className, items } = props;
	const [isOpen, setIsOpen] = React.useState(false);
	return (
		<div className={styles["dropdown-component"]}>
			<ToolIconButton
				className={className ?? "external-ref_button_dropdown"}
				icon="arrow_drop_down"
				title={title}
				onClick={() => setIsOpen(!isOpen)}
			/>
			<div className={styles["dropdown-menu"]}>
				{isOpen && (
					items.map((item) => (
						<div
							key={item.label}
							className={styles["dropdown-item"]}
							title={item.tooltip}
							onClick={() => {
								item.onClick();
								setIsOpen(false);
							}}
						>
							{item.label}
						</div>
					))
				)}
			</div>
		</div>
	);
});
