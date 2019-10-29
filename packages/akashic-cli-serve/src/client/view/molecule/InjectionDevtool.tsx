import * as React from "react";
import { ObservableMap } from "mobx";
import { observer } from "mobx-react";
import { SandboxConfigInjectionConfig, SandboxConfigInjectionItem } from "../../../common/types/SandboxConfig";
import { FlexScrollY } from "../atom/FlexScrollY";
import { ToolIconButton } from "../atom/ToolIconButton";
import * as styles from "./InjectionDevtool.css";

export interface InjectionDevtoolProps {
	valueTable: ObservableMap<string, any>;
	injectionConfig: SandboxConfigInjectionConfig;
	onChange?: (key: string, value: any) => void;
	onBlur?: (key: string, value: any) => void;
}

function renderInjectionConfigItem(
	key: string,
	item: SandboxConfigInjectionItem,
	value: any,
	onChange: (key: string, value: any) => void,
	onBlur: (key: string, value: any) => void
): React.ReactNode {
	let control: React.ReactNode;
	switch (item.type) {
	case "range":
		control = <input
			type="range"
			style={{ width: "100%" }}
			value={(value != null) ? value : (item.min || 0)}
			min={item.min || 0}
			max={(item.max != null) ? item.max : 100}
			step={item.step || 1}
			onChange={(ev: React.ChangeEvent<HTMLInputElement>) => onChange(key, Number(ev.target.value))}
			onBlur={() => onBlur(key, Number(value))}
		/>;
		break;
	case "checkbox":
		control = <input
			type="checkbox"
			checked={!!value}
			onChange={() => onChange(key, !value)}
		/>;
		break;
	default:
		control = <div>unknown type: {"" + item.type}</div>
		break;
	}

	return <tr key={key}>
		<td>{key}</td>
		<td>{control}</td>
	</tr>;
}

@observer
export class InjectionDevtool extends React.Component<InjectionDevtoolProps, {}> {
	render(): React.ReactNode {
		const props = this.props;
		const items = props.injectionConfig ? props.injectionConfig.items : {};
		const valueTable = props.valueTable;
		const onChange = props.onChange || (() => {});
		const onBlur = props.onBlur || (() => {});
		return <div className={styles["injection-devtool"]}>
			<FlexScrollY>
				<table className={styles["injection-table"]}>
					<tbody>
						{
							Object.keys(items).map(key => {
								return renderInjectionConfigItem(
									key,
									items[key],
									valueTable.get(key),
									onChange,
									onBlur);
							})
						}
					</tbody>
				</table>
			</FlexScrollY>
		</div>;
	}
}

