// @flow

import React from "react";
import Text from "~/renderer/components/Text";

const innerStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "100%",
};

const Ellipsis = ({ children, canSelect, ...p }: { children: any, canSelect?: boolean }) => (
  <Text style={{ ...innerStyle, userSelect: canSelect ? "text" : "none" }} {...p}>
    {children}
  </Text>
);

export default Ellipsis;
