import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "./ToolIconButton.css";

export interface ToolIconButtonProps {
	/**
	 * アイコン名。
	 * Material Icons の名前である必要がある。
	 */
	icon: string;
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
	onClick?: (nextVal?: boolean) => void;
}

@observer
export class ToolIconButton extends React.Component<ToolIconButtonProps, {}> {
	render() {
		const { icon, title, pushed, pushedIcon, disabled, children } = this.props;
		const pushedClass = (pushed && !pushedIcon) ? " " + styles["pushed"] : "";
		return <button className={styles["tool-icon-button"] + pushedClass}
		               disabled={disabled} title={title} onClick={this._onClick}>
			<i className="material-icons">{(pushed && pushedIcon) ? pushedIcon : icon}</i>
			{ children ? <p>{children}</p> : null }
		</button>;
	}

	private _onClick = (): void => {
		this.props.onClick(!this.props.pushed);
	}
}
