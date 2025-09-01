import { observer } from "mobx-react";
import * as React from "react";
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
	setShowMenu: (show: boolean) => void;
}

interface DropDownMenuItem {
	label: string;
	tooltip?: string;
	icon?: string;
	onClick: () => void;
}

export const ToolIconButton = observer(function ToolIconButton(props: ToolIconButtonProps): JSX.Element {
	const { className, icon, title, pushed, pushedIcon, disabled, children, size, onClick, splitButtonProps } = props;
	const pushedClass = (pushed && !pushedIcon) ? " " + styles.pushed : "";
	return <div className={styles["tool-icon-button-container"]}>
		<button className={styles["tool-icon-button"] + pushedClass + " " + className}
			disabled={disabled} title={title} onClick={(event: React.MouseEvent): void => {
				event.stopPropagation(); // 親のクリックイベントを防ぐ
				onClick?.(!pushed);
			}}>
			<i className="material-icons" style={(size != null) ? { fontSize: size } : undefined}>
				{(pushed && pushedIcon) ? pushedIcon : icon}
			</i>
			{ children ? <p>{children}</p> : null }
		</button>
		{splitButtonProps && splitButtonProps.menuItems.length > 0 &&
		<SplitButton
			menuItems={splitButtonProps.menuItems}
			showMenu={splitButtonProps.showMenu}
			setShowMenu={splitButtonProps.setShowMenu}
		/>}
	</div>;
});


const SplitButton = observer(function SplitButton(props: SplitButtonProps): JSX.Element {
	const { menuItems, showMenu, setShowMenu } = props;
	const menuRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent): void => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setShowMenu(false);
			}
		};
		if (showMenu) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [showMenu]);

	return (
		<div className={styles["dropdown-component"]} ref={menuRef}>
			<button className={styles["tool-icon-button"]} onClick={() => setShowMenu(!showMenu)}>
				<i className="material-icons">arrow_drop_down</i>
			</button>
			{showMenu && (
				<div className={styles["dropdown-menu"]}>
					{menuItems.map((item, index) => (
						<div
							key={index}
							className={styles["dropdown-item"]}
							title={item.tooltip}
							onClick={() => {
								item.onClick();
								setShowMenu(false);
							}}
						>
							<i className="material-icons">{item.icon ?? undefined}</i>
							{item.label}
						</div>
					))}
				</div>
			)}
		</div>
	);
});
