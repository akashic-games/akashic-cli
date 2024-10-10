import { observer } from "mobx-react";
import * as React from "react";
import * as styles from "./ToolIconButton.module.css";

export interface ToolIconButtonProps {
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

export const ToolIconButton = observer(class ToolIconButton extends React.Component<ToolIconButtonProps, {}> {
	render(): JSX.Element {
		const { className, icon, title, pushed, pushedIcon, disabled, children, size } = this.props;
		const pushedClass = (pushed && !pushedIcon) ? " " + styles.pushed : "";
		return <button className={styles["tool-icon-button"] + pushedClass + " " + className}
			disabled={disabled} title={title} onClick={this._onClick}>
			<i className="material-icons" style={(size != null) ? { fontSize: size } : undefined}>
				{(pushed && pushedIcon) ? pushedIcon : icon}
			</i>
			{ children ? <p>{children}</p> : null }
		</button>;
	}

	private _onClick = (): void => {
		this.props.onClick?.(!this.props.pushed);
	};
});

