//  @flow

import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setTheme } from "~/renderer/actions/settings";
import { themeSelector } from "~/renderer/reducers/settings";
import Select from "~/renderer/components/Select";

const themeLabels = {
  light: "theme.light",
  dusk: "theme.dusk",
  dark: "theme.dark",
};

const ThemeSelect = () => {
  const dispatch = useDispatch();
  const theme = useSelector(themeSelector);
  const { t } = useTranslation();

  const handleChangeTheme = useCallback(
    ({ value: themeKey }: { value: string }) => {
      dispatch(setTheme(themeKey));
    },
    [dispatch],
  );

  const options = useMemo(
    () =>
      Object.keys(themeLabels).map(key => ({
        value: key,
        label: t(themeLabels[key]),
      })),
    [],
  );

  const currentTheme = options.find(option => option.value === theme);

  return (
    <>
      {/* TODO: tracking */}
      {/* <Track onUpdate event="ThemeSelect" currentTheme={theme} /> */}
      <Select
        small
        minWidth={260}
        isSearchable={false}
        onChange={handleChangeTheme}
        value={currentTheme}
        options={options}
      />
    </>
  );
};

export default ThemeSelect;
