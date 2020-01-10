// @flow
import styled from "styled-components";
import { radii } from "~/renderer/styles/theme";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";

const OnboardingFooterWrapper: ThemedComponent<{}> = styled(Box).attrs(() => ({
  px: 5,
  py: 3,
  horizontal: true,
}))`
  border-top: 2px solid ${p => p.theme.colors.palette.divider};
  border-bottom-left-radius: ${radii[1]}px;
  border-bottom-right-radius: ${radii[1]}px;
  justify-content: space-between;
`;

export default OnboardingFooterWrapper;
