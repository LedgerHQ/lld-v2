// @flow
import React from "react";
import styled, { withTheme } from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import BigSpinner from "~/renderer/components/BigSpinner";
import Box from "~/renderer/components/Box";

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  alignItems: "center",
  grow: true,
  color: "palette.text.shade100",
}))`
  justify-content: center;
  min-height: 220px;
`;

const Title: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter",
  fontSize: 5,
  mt: 2,
}))`
  text-align: center;
  word-break: break-word;
`;

type Props = {
  theme: *,
  children?: React$Node,
};

const StepProgress = ({ theme, children }: Props) => {
  return (
    <Container>
      <span style={{ color: theme.colors.palette.text.shade60 }}>
        <BigSpinner size={50} />
      </span>

      <Title>{children}</Title>
    </Container>
  );
};

export default withTheme(StepProgress);
