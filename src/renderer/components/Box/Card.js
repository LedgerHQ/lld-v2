// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";
import Box from "./Box";

const RawCard: ThemedComponent<{
  bg?: string,
  color?: string,
}> = styled(Box).attrs(p => ({
  bg: p.bg || "palette.background.paper",
  boxShadow: 0,
  borderRadius: 1,
  color: p.color || "inherit",
}))``;

type Props = {
  bg?: string,
  color?: string,
  title?: any,
  children?: React$Node,
};

const Card = ({ title, ...props }: Props) => {
  if (title) {
    return (
      <Box flow={4} grow>
        <Text color="palette.text.shade100" ff="Inter" fontSize={6}>
          {title}
        </Text>
        <RawCard {...props} grow />
      </Box>
    );
  }
  return <RawCard {...props} />;
};

export default Card;
