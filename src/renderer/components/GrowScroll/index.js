// @flow

import React, { useMemo } from "react";

// DIRTY HACK, THERE IS PROBABLY A BETTER WAY TO DO THIS
import measureScrollbar from "~/renderer/measureScrollbar";

import Box from "~/renderer/components/Box";

type Props = {
  children: any,
  full: boolean,
  maxHeight?: number,
};

// $FlowFixMe
export const GrowScrollContext = React.createContext();

const scrollbarWidth = measureScrollbar();

const GrowScroll = (
  { children, full = false, maxHeight, ...props }: Props,
  ref: React$Ref<React$ElementRef<any>>,
) => {
  // TODO: FIX FLOW FOR ref.current
  const valueProvider = useMemo(() => ({ scrollContainer: ref ? ref.current : null }), [ref]);

  const scrollContainerStyles = useMemo(
    () => ({
      overflowY: "scroll",
      marginRight: `-${80 + scrollbarWidth}px`,
      paddingRight: `80px`,
      display: "flex",
      flexDirection: "column",
      ...(maxHeight
        ? {
            maxHeight,
          }
        : {
            bottom: 0,
            left: 0,
            position: "absolute",
            right: 0,
            top: 0,
          }),
    }),
    [maxHeight],
  );

  const rootStyles = useMemo(
    () => ({
      overflow: "hidden",
      ...(full
        ? {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }
        : {
            display: "flex",
            flex: 1,
            position: "relative",
          }),
    }),
    [full],
  );

  return (
    <div style={rootStyles}>
      <div style={scrollContainerStyles} ref={ref}>
        <Box grow {...props}>
          <GrowScrollContext.Provider value={valueProvider}>{children}</GrowScrollContext.Provider>
        </Box>
      </div>
    </div>
  );
};

export default React.forwardRef<Props, *>(GrowScroll);
