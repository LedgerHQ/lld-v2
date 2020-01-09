// @flow

import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";

const OptionRowDesc: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: 4,
  textAlign: "left",
  color: "palette.text.shade80",
  grow: true,
  pl: 2,
}))``;

export default OptionRowDesc;
