import * as React from "react";
import { observer } from "mobx-react";

export interface ContentDisplayDialogProps {
	showsBgImage: boolean;
	showsGridCanvas: boolean;
	setShowsBgImage: (show: boolean) => void;
	setShowsGridCanvas: (show: boolean) => void;
}

@observer
export class ContentDisplayDialog extends React.Component<ContentDisplayDialogProps, {}> {
	render(): React.ReactNode {
		const {
			showsBgImage,
			showsGridCanvas,
			setShowsBgImage,
			setShowsGridCanvas
		} =  this.props;
		return <div>
			<ul>
				<li>
					<input id="show-bg-img" type="checkbox" checked={showsBgImage} onChange={() => setShowsBgImage(!showsBgImage)} />背景画像表示
				</li>
				<li>
					<input id="show-grid" type="checkbox" checked={showsGridCanvas} onChange={() => setShowsGridCanvas(!showsGridCanvas)} />グリッド表示
				</li>
			</ul>
		</div>;
	}
}
