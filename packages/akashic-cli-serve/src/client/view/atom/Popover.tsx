import { observer } from "mobx-react";
import * as React from "react";
import styles from "./Popover.module.css";

export function useOnClickOutside(ref: React.RefObject<HTMLElement> | undefined, handler: () => void): void {
	React.useEffect(
		() => {
			if (!ref || !ref.current)
				return;
			const handleDown = (ev: MouseEvent): void => {
				const target = ev.target;
				if (!ref || !ref.current || !(target instanceof Element) || ref.current.contains(target as Element)) {
					return;
				}
				handler();
			};
			window.addEventListener("mousedown", handleDown);
			return () => {
				window.removeEventListener("mousedown", handleDown);
			};
		},
		[ref, handler]
	);
}

export interface PopoverProps {
	caption: string;
	shows: boolean;
	onChangeShows: (show: boolean) => void;
	className?: string;
	style?: React.CSSProperties;
	children?: React.ReactNode;
	outsideRef?: React.RefObject<HTMLElement>;
}

export const Popover = observer(function Popover(props: PopoverProps) {
	const { caption, shows, onChangeShows, className, children, outsideRef } = props;
	const handleClickOutside = React.useCallback(() => {
		onChangeShows(false);
	}, [shows, onChangeShows]);
	useOnClickOutside(outsideRef, handleClickOutside);

	if (!shows)
		return null;

	return (
		<div className={className} style={{ zIndex: 1000 }}>
			<div className={styles.popover}>
				<h3 className={styles.caption}>{caption}</h3>
				<div className={styles.controls}>
					{ children }
				</div>
			</div>
		</div>
	);
});
