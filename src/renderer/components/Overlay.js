// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { rgba } from "~/renderer/styles/helpers";
import Box from "~/renderer/components/Box";

const Overlay: ThemedComponent<{}> = styled(({ sticky, ...props }) => <Box sticky {...props} />)`
  background-color: ${p => rgba(p.theme.colors.palette.text.shade100, 0.4)};
  position: fixed;
`;

export default Overlay;
