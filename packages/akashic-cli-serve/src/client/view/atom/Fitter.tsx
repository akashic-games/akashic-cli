import { raw } from "express";
import * as React from "react";
import Measure, { ContentRect } from "react-measure";
import { deflateSync } from "zlib";
import * as styles from "./Fitter.css";

export interface FitterProps {
	children?: React.ReactNode;
}

export function Fitter(props: FitterProps): React.ReactElement<FitterProps> {
  const [outerRect, setOuterRect] = React.useState({ width: 0, height: 0 });
  const [innerRect, setInnerRect] = React.useState({ width: 0, height: 0 });

  const onResizeOuter = React.useCallback((rect: ContentRect) => {
    setOuterRect({ width: rect.client?.width!, height: rect.client?.height! });
  }, []);
  const onResizeInner = React.useCallback((rect: ContentRect) => {
    setInnerRect({ width: rect.scroll?.width!, height: rect.scroll?.height! });
  }, []);

  const ratio = Math.min(
    outerRect.width / innerRect.width,
    outerRect.height / innerRect.height
  ) || 1;

  const needsScale = true; // (ratio >= 1) を使いたいが振動する時があるので一旦決め打ち
  const innerClassName = needsScale ? "inner-shrank" : "inner-normal";
  const innerStyle = needsScale ? { transform: `scale(${ratio})` } : null;

  return (
    <Measure client onResize={onResizeOuter}>
      {({ measureRef }) => (
        <div ref={measureRef} className={styles.fitter}>
          <div ref={measureRef} className={styles.outer}>
            <Measure scroll onResize={onResizeInner}>
              {({ measureRef }) => (
                <div
                  ref={measureRef}
                  className={`${styles.inner} ${styles[innerClassName]}`}
                  style={innerStyle}
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