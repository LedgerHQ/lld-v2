// @flow

import React from "react";
import { useTranslation } from "react-i18next";

import Space from "~/renderer/components/Space";
import Text from "~/renderer/components/Text";
import TrackPage from "~/renderer/analytics/TrackPage";
import Connect from "./Connect";
import Box from "~/renderer/components/Box";

type Props = {
  onSuccess: void => void,
};

const ManagerConnect = ({ onSuccess }: Props) => {
  const { t } = useTranslation();

  return (
    <Box alignItems="center" py={7} selectable>
      <TrackPage category="Manager" name="Genuine Check" />
      <Box alignItems="center" style={{ maxWidth: 460 }}>
        <Text
          ff="Inter|Regular"
          fontSize={7}
          color="palette.text.shade100"
          style={{ marginBottom: 10 }}
        >
          {t("manager.device.title")}
        </Text>
        <Text ff="Inter|Light" fontSize={5} color="palette.text.shade60" align="center">
          {t("manager.device.desc")}
        </Text>
      </Box>
      <Space of={40} />
      <Connect shouldRenderRetry onSuccess={onSuccess} style={{ width: 400 }} />
    </Box>
  );
};

export default ManagerConnect;
