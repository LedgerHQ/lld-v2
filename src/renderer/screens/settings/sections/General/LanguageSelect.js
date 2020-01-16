// @flow

import React, { useMemo, useCallback } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { allLanguages, prodStableLanguages } from "~/config/languages";
import useEnv from "~/renderer/hooks/useEnv";
import { setLanguage } from "~/renderer/actions/settings";
import { langAndRegionSelector } from "~/renderer/reducers/settings";
import Select from "~/renderer/components/Select";
import Track from "~/renderer/analytics/Track";

const languageLabels = {
  en: "English",
  fr: "Français",
  es: "Español",
  ko: "한국어",
  zh: "简体中文",
  ja: "日本語",
  ru: "Русский",
};

type LangKeys = $Keys<typeof languageLabels>;
type ChangeLangArgs = { value: LangKeys, label: string };

const LanguageSelect = () => {
  const { useSystem, language } = useSelector(langAndRegionSelector);
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();

  const debugLanguage = useEnv("EXPERIMENTAL_LANGUAGES");

  const languages = useMemo(
    () =>
      [{ value: null, label: t(`language.system`) }].concat(
        (debugLanguage ? allLanguages : prodStableLanguages).map(key => ({
          value: key,
          label: languageLabels[key],
        })),
      ),
    [t, debugLanguage],
  );

  const currentLanguage = useMemo(
    () => (useSystem ? languages[0] : languages.find(l => l.value === language)),
    [language, languages, useSystem],
  );

  const handleChangeLanguage = useCallback(
    ({ value: languageKey }: ChangeLangArgs) => {
      i18n.changeLanguage(languageKey);
      moment.locale(languageKey);
      dispatch(setLanguage(languageKey));
    },
    [dispatch, i18n],
  );

  return (
    <>
      <Track
        onUpdate
        event="LanguageSelect"
        currentRegion={currentLanguage && currentLanguage.value}
      />

      <Select
        small
        minWidth={260}
        isSearchable={false}
        onChange={handleChangeLanguage}
        renderSelected={item => item && item.name}
        value={currentLanguage}
        options={languages}
      />
    </>
  );
};

export default LanguageSelect;
