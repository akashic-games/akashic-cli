import * as React from "react";
import Measure, { ContentRect } from "react-measure";
import * as styles from "./Fitter.css";

export interface FitterProps {
	children?: React.ReactNode;
}

export function Fitter(props: FitterProps): React.ReactElement<FitterProps> {
  const [outerWidth, setOuterWidth] = React.useState(0);
  const [outerHeight, setOuterHeight] = React.useState(0);
  const [innerWidth, setInnerWidth] = React.useState(0);
  const [innerHeight, setInnerHeight] = React.useState(0);

  const onResizeOuter = React.useCallback((rect: ContentRect) => {
    console.log("RESIZE-OUTER", rect.client);
    setOuterWidth(rect.client?.width!);
    setOuterHeight(rect.client?.height!);
  }, []);
  const onResizeInner = React.useCallback((rect: ContentRect) => {
    console.log("RESIZE-INNER", rect.scroll);
    setInnerWidth(rect.scroll?.width!);
    setInnerHeight(rect.scroll?.height!);
  }, []);

  const ratio = Math.min(outerWidth / innerWidth, outerHeight / innerHeight) || 1;
  console.log({
    ow: outerWidth,
    iw: innerWidth,
    oh: outerHeight,
    ih: innerHeight,
    ratioW: outerWidth / innerWidth,
    ratioH: outerHeight / innerHeight,
    ratio
  });

  return (
    <Measure client onResize={onResizeOuter}>
      {({ measureRef }) => (
        <div ref={measureRef} className={styles.fitter}>
          <div ref={measureRef} className={styles.outer}>
            <Measure scroll onResize={onResizeInner}>
              {({ measureRef }) => (
                <div
                  ref={measureRef}
                  className={`${styles.inner} ${styles[ratio >= 1 ? "inner-normal" : "inner-shrank"]}`}
                  style={ratio >= 1 ? null : { transform: `scale(${ratio})` }}
                >
                  { props.children }
                </div>
              )}
            </Measure>
          </div>
        </div>
      )}
    </Measure>
  );
}