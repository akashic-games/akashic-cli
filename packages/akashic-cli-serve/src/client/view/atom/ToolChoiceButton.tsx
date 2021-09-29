import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "./ToolChoiceButton.css";

export interface ToolChoiceButtonItem {
  label: string;
  title?: string;
  disabled?: boolean;
  className?: string;
}

export interface ToolChoiceButtonProps {
  items: ToolChoiceButtonItem[];
  pushedIndex?: number | null;
	disabled?: boolean;
	className?: string;
	onClick?: (index: number) => void;
}

interface SingleButtonProps {
  index: number;
  className?: string;
  title?: string;
  pushed?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: (index: number) => void;
}

// TODO: まじめに clsx とか使う？
function mixClassName(...names: (string | null)[]): string {
  let ret = "";
  for (let i = 0; i < names.length; ++i) {
    const name = names[i];
    if (name)
      ret += (ret ? " " : "") + name;
  }
  return ret;
}

const SingleButton = observer(function SingleButton(props: SingleButtonProps) {
  const { index, className, title, pushed, disabled, onClick, children } = props;
  const handleClick = React.useCallback(() => onClick(index), [onClick, index]);
  return (
    <button
      className={mixClassName(styles["tool-choice-button-single"], (pushed ? styles["pushed"] : ""), className)}
      disabled={disabled}
      title={title}
      onClick={handleClick}
    >
      { children }
    </button>
   );
}) ;

export const ToolChoiceButton = observer(function ToolChoiceButton(props: ToolChoiceButtonProps) {
  const { items, pushedIndex, disabled, className, onClick } = props;
  return <div className={mixClassName(styles["tool-choice-button"], className)}>
    {
      items.map((item, i) => {
        return (
          <SingleButton
            key={i}
            index={i}
            className={item.className}
            pushed={i === pushedIndex}
            disabled={disabled || item.disabled}
            title={item.title}
            onClick={onClick}
          >
            { item.label }
          </SingleButton>
        );
      })
    }
  </div>;
});