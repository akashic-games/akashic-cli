import { observer } from "mobx-react";
import * as React from "react";
import styles from "./ToolCheckbox.module.css";

export interface ToolCheckboxProps {
	checked: boolean;
	label?: string;
	onChange: (checked: boolean) => void;
}

export const ToolCheckbox = observer(function ToolCheckbox(props: ToolCheckboxProps) {
	const { checked, label, onChange } = props;
	const handleChange = React.useCallback(() => onChange(!checked), [checked, onChange]);
	return (
		<label className={styles["switch-option"]}>
			<input type="checkbox" checked={checked} onChange={handleChange} />
			{ label }
		</label>
	);
});
