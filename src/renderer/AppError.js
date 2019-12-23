// @flow
import React from "react";
import { ThemeProvider } from "styled-components";
import theme, { colors } from "~/renderer/styles/theme";
import palette from "~/renderer/styles/palettes";
import "~/renderer/i18n/init";
import TriggerAppReady from "~/renderer/components/TriggerAppReady";
import RenderError from "~/renderer/components/RenderError";

// Like App except it just render an error

const themePalette = palette.light;
const lightLiveTheme = {
  ...theme,
  colors: {
    ...colors,
    palette: themePalette,
  },
};

const App = ({ language, error }: { error: Error, language: string }) => (
  <ThemeProvider theme={lightLiveTheme}>
    <RenderError withoutAppData error={error}>
      <TriggerAppReady />
    </RenderError>
  </ThemeProvider>
);

export default App;
