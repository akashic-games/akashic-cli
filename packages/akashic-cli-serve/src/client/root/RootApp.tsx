import * as React from "react";
import { observer } from "mobx-react";
import { RootFrameStore } from "../store/RootFrameStore";
import { RootOperator } from "./operator/RootOperator";
import { RootToolBarContainer } from "./container/RootToolBarContainer";
import "../view/global.css";
import * as styles from "./RootApp.css";

export interface RootAppProps {
	store: RootFrameStore;
	operator: RootOperator;
}

export const RootApp = observer(function RootApp(props: RootAppProps) {
  const { store, operator } = props;

  return <div id="whole" className={styles["whole"]}>
    <RootToolBarContainer
      play={store.currentPlay}
      operator={operator}
      store={store}
      targetService={store.targetService}
    />
    <div className={styles["main"]}>
      {
        store.panes.map(paneKey => (
          <iframe
            key={paneKey}
            src={`/public/frame.html?paneKey=${paneKey}&ignoreSession=1`}
            className={styles["framebox"]} style={store.panes.length === 1 ? { flexBasis: "100%" } : null}>
          </iframe>
        ))
      }
    </div>
  </div>;
});
