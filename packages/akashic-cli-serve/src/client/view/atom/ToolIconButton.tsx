import { observer } from "mobx-react";
import * as React from "react";
import { useOnClickOutside } from "./Popover";
import styles from "./ToolIconButton.module.css";

interface ToolIconButtonProps {
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
	/**
	 * スプリットボタン用Props
	 */
	splitButtonProps?: SplitButtonProps;
}

interface SplitButtonProps {
	menuItems: DropDownMenuItem[];
	showMenu: boolean;
	onToggleMenu: (show: boolean) => void;
}

interface DropDownMenuItem {
	label: string;
	key?: string;
	tooltip?: string;
	icon?: string;
	onClick: () => void;
}

export const ToolIconButton = observer(function ToolIconButton(props: ToolIconButtonProps): JSX.Element {
	const { className, icon, title, pushed, pushedIcon, disabled, children, size, onClick, splitButtonProps } = props;
	const pushedClass = (pushed && !pushedIcon) ? " " + styles.pushed : "";
	const hasSplitButton = splitButtonProps != null && splitButtonProps.menuItems.length > 0;
	return <div className={styles["tool-icon-button-container"]}>
		<button className={`${styles["tool-icon-button"]} ${hasSplitButton ? styles["with-split-button"] : ""} ${pushedClass} ${className}`}
			disabled={disabled} title={title} onClick={(): void => {
				onClick?.(!pushed);
			}}>
			<i className="material-icons" style={(size != null) ? { fontSize: size } : undefined}>
				{(pushed && pushedIcon) ? pushedIcon : icon}
			</i>
			{ children ? <p>{children}</p> : null }
		</button>
		{
			hasSplitButton && (
				<SplitButton
					menuItems={splitButtonProps.menuItems}
					showMenu={splitButtonProps.showMenu}
					onToggleMenu={splitButtonProps.onToggleMenu}
				/>
			)
		}
	</div>;
});


const SplitButton = observer(function SplitButton(props: SplitButtonProps): JSX.Element {
	const { menuItems, showMenu, onToggleMenu } = props;
	const menuRef = React.useRef<HTMLDivElement>(null);
	const handleClickOutside = React.useCallback(() => {
		onToggleMenu(false);
	}, [showMenu, onToggleMenu]);
	useOnClickOutside(menuRef, handleClickOutside);

	return (
		<div className={styles["dropdown-component"]} ref={menuRef}>
			<button className={styles["tool-icon-button"] + " " + styles["as-split-button"]} onClick={() => onToggleMenu(!showMenu)}>
				<div className={styles["down-arrow"]}></div>
			</button>
			{
				showMenu && (
					<div className={styles["dropdown-menu"]}>
						{menuItems.map((item) => (
							<div
								key={item.key ?? item.label}
								className={styles["dropdown-item"]}
								title={item.tooltip}
								onClick={() => {
									item.onClick();
									onToggleMenu(false);
								}}
							>
								<i className="material-icons">{item.icon ?? undefined}</i>
								{item.label}
							</div>
						))}
					</div>
				)
			}
		</div>
	);
});
