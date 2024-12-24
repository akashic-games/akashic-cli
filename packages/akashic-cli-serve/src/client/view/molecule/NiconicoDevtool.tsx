import { observer } from "mobx-react";
import * as React from "react";
import { DevtoolPageSelector } from "../atom/DevtoolPageSelector";
import { RightResizable } from "../atom/RightResizable";
import styles from "./NiconicoDevtool.module.css";
import { NiconicoDevtoolCommentPage, type NiconicoDevtoolCommentPageProps } from "./NiconicoDevtoolCommentPage";
import { NiconicoDevtoolRankingPage, type NiconicoDevtoolRankingPageProps } from "./NiconicoDevtoolRankingPage";

export type NiconicoDevtoolPageType = "ranking" | "comment";

const pages: { key: NiconicoDevtoolPageType; label: string }[] = [
	{ key: "ranking", label: "Ranking" },
	{ key: "comment", label:  "Comment" },
];

export interface NiconicoDevtoolProps {
	activePage: NiconicoDevtoolPageType;
	rankingPageProps: NiconicoDevtoolRankingPageProps;
	commentPageProps: NiconicoDevtoolCommentPageProps;
	selectorWidth: number;
	onResizeSelector: (size: number) => void;
	onChangePage: (page: NiconicoDevtoolPageType) => void;
}

const SELECTOR_MIN = 120;

export const NiconicoDevtool = observer(function (props: NiconicoDevtoolProps) {
	const handleChangePage = React.useCallback((idx: number) => {
		props.onChangePage(pages[idx].key);
	}, [props.onChangePage]);

	return (
		<div className={styles["niconico-devtool"]}>
			<RightResizable
				width={Math.max(props.selectorWidth, SELECTOR_MIN)}
				minWidth={SELECTOR_MIN}
				onResize={props.onResizeSelector}
			>
				<DevtoolPageSelector
					items={pages.map(p => p.label)}
					activeIndex={pages.findIndex(p => p.key === props.activePage)}
					onChangeActive={handleChangePage}
				/>
			</RightResizable>
			<div className={styles.page}>
				{
					(props.activePage === "ranking") ?
						<NiconicoDevtoolRankingPage {...props.rankingPageProps} /> :
					(props.activePage === "comment") ?
						<NiconicoDevtoolCommentPage {...props.commentPageProps} /> :
						null
				}
			</div>
		</div>
	);
});
