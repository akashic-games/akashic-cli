import { observer } from "mobx-react";
import * as React from "react";
import styles from "./ToolIconButton.module.css";

export interface ToolIconButtonProps extends ToolIconButtonPrimitiveProps {
	dropdownProps?: ToolDropdownButtonProps;
}

interface ToolIconButtonPrimitiveProps {
	/**
	 * アイコン名。
	 * Material Icons の名前である必要がある。
	 */
	icon: string;
	/**
	 * 要素のclass属性に与える文字列。
	 */
	className?: string;
	/**
	 * 要素のtitle属性に与える文字列。
	 */
	title?: string;
	/**
	 * 押下状態であるか。
	 * 真理値を与えるとトグルボタンにできる。
	 */
	pushed?: boolean;
	/**
	 * 押下状態のアイコン。
	 * 指定されない場合、押下状態ではグレーアウトする独自のデザインが使われる。
	 */
	pushedIcon?: string;
	/**
	 * 無効状態であるか。
	 */
	disabled?: boolean;
	/**
	 * クリックされた時のハンドラ。
	 * 引数は `!pushed` の値。
	 */
	onClick?: (nextVal: boolean) => void;
	/**
	 * ボタンのサイズ。
	 */
	size?: number;
	/**
	 * ReactNode
	 */
	children?: React.ReactNode;
}

interface ToolDropdownButtonProps {
	items: ToolDropdownItem[];
	showMenu: boolean;
	onClick: () => void;
}

interface ToolDropdownItem {
	label: string;
	tooltip?: string;
	onClick: () => void;
}

export const ToolIconButton = observer(function ToolIconButton(props: ToolIconButtonProps): JSX.Element {
	const { dropdownProps } = props;
	const dropDownButton = dropdownProps ? <ToolDropdownButton
		items={dropdownProps.items}
		showMenu={dropdownProps.showMenu}
		onClick={dropdownProps.onClick}
	/> : null;
	return <ToolIconButtonPrimitive {...props}>{dropDownButton}</ToolIconButtonPrimitive>;
});

const ToolIconButtonPrimitive = observer(function ToolIconButtonPrimitive(props: ToolIconButtonPrimitiveProps): JSX.Element {
	const { className, icon, title, pushed, pushedIcon, disabled, children, size, onClick } = props;
	const pushedClass = (pushed && !pushedIcon) ? " " + styles.pushed : "";
	return <button className={styles["tool-icon-button"] + pushedClass + " " + className}
		disabled={disabled} title={title} onClick={(event: React.MouseEvent): void => {
			event.stopPropagation(); // 親のクリックイベントを防ぐ
			onClick?.(!pushed);
		}}>
		<i className="material-icons" style={(size != null) ? { fontSize: size } : undefined}>
			{(pushed && pushedIcon) ? pushedIcon : icon}
		</i>
		{ children ? <p>{children}</p> : null }
	</button>;
});

const ToolDropdownButton = observer(function ToolDropdownButton(props: ToolDropdownButtonProps): JSX.Element {
	const { items, showMenu, onClick } = props;
	return (
		<div className={styles["dropdown-component"]}>
			<ToolIconButtonPrimitive
				icon="arrow_drop_down"
				onClick={onClick}
			/>
			<div className={styles["dropdown-menu"]}>
				{showMenu && (
					items.map((item) => (
						<div
							key={item.label}
							className={styles["dropdown-item"]}
							title={item.tooltip}
							onClick={item.onClick}
						>
							{item.label}
						</div>
					))
				)}
			</div>
		</div>
	);
});
