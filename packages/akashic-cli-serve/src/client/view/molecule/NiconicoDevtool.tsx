import { observer } from "mobx-react";
import * as React from "react";
import type { DevtoolPageSelectorItem } from "../atom/DevtoolPageSelector";
import { DevtoolPageSelector } from "../atom/DevtoolPageSelector";
import { RightResizable } from "../atom/RightResizable";
import styles from "./NiconicoDevtool.module.css";
import { NiconicoDevtoolCommentPage, type NiconicoDevtoolCommentPageProps } from "./NiconicoDevtoolCommentPage";
import { NiconicoDevtoolRankingPage, type NiconicoDevtoolRankingPageProps } from "./NiconicoDevtoolRankingPage";

export type NiconicoDevtoolPageType = "ranking" | "comment";

const rankingPageSelectorItem: DevtoolPageSelectorItem = {
	label: "Ranking",
	key: "ranking",
	title: "Ranking",
};

const commentPageSelectorItem: DevtoolPageSelectorItem = {
	label: <><small>&#x1f6a7;</small> Comment</>,
	key: "comment",
	title: "Comment (Experimental)",
};

const pageItems: { key: NiconicoDevtoolPageType; selector: DevtoolPageSelectorItem }[] = [
	{ key: "ranking", selector: rankingPageSelectorItem },
	{ key: "comment", selector: commentPageSelectorItem },
];

const pageItemsNoComment: { key: NiconicoDevtoolPageType; selector: DevtoolPageSelectorItem }[] = [
	{ key: "ranking", selector: rankingPageSelectorItem },
	{ key: "comment", selector: { ...commentPageSelectorItem, disabled: true } },
];

export interface NiconicoDevtoolProps {
	activePage: NiconicoDevtoolPageType;
	rankingPageProps: NiconicoDevtoolRankingPageProps;
	commentPageProps: NiconicoDevtoolCommentPageProps | null;
	selectorWidth: number;
	onResizeSelector: (size: number) => void;
	onChangePage: (page: NiconicoDevtoolPageType) => void;
}

const SELECTOR_MIN = 120;

export const NiconicoDevtool = observer(function (props: NiconicoDevtoolProps) {
	const pages = (props.commentPageProps) ? pageItems : pageItemsNoComment;

	const handleChangePage = React.useCallback((idx: number) => {
		props.onChangePage(pages[idx].key);
	}, [props.onChangePage, pages]);

	return (
		<div className={styles["niconico-devtool"]}>
			<RightResizable
				width={Math.max(props.selectorWidth, SELECTOR_MIN)}
				minWidth={SELECTOR_MIN}
				onResize={props.onResizeSelector}
			>
				<DevtoolPageSelector
					items={pages.map(p => p.selector)}
					activeIndex={pages.findIndex(p => p.key === props.activePage)}
					onChangeActive={handleChangePage}
				/>
			</RightResizable>
			<div className={styles.page}>
				{
					(props.activePage === "ranking") ?
						<NiconicoDevtoolRankingPage {...props.rankingPageProps} /> :
					(props.activePage === "comment" && props.commentPageProps) ?
						<NiconicoDevtoolCommentPage {...props.commentPageProps} /> :
						null
				}
			</div>
		</div>
	);
});
