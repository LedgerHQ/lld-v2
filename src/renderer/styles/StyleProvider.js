// @flow

import React from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "~/renderer/styles/global";
import type { StyledComponent } from "styled-components";

import defaultTheme from "./theme";
import palettes from "./palettes";
import type { Theme } from "./theme";

type Props = {
  children: React$Node,
  selectedPalette: string,
};

export type ThemedComponent<T> = StyledComponent<T, Theme, *>;

const StyleProvider = ({ children, selectedPalette }: Props) => {
  const theme: Theme = {
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors,
      palette: palettes[selectedPalette],
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};

export default StyleProvider;
