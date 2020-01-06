// @flow

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import TranslatedError from "~/renderer/components/TranslatedError";
import CheckCircle from "~/renderer/icons/CheckCircle";
import ExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { StepProps } from "../";

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  alignItems: "center",
  fontSize: 4,
  color: "palette.text.shade100",
}))``;

const Title = styled(Box).attrs(() => ({
  fontFamily: "Inter",
  fontSize: 6,
  color: "palette.text.shade100",
}))`
  font-weight: 500;
`;

const StepConfirmation = ({ error }: StepProps) => {
  const { t } = useTranslation();
  if (error) {
    return (
      <Container>
        <Box color="alertRed">
          <ExclamationCircleThin size={44} />
        </Box>
        <Box
          color="palette.text.shade100"
          mt={4}
          fontSize={5}
          ff="Inter|Regular"
          textAlign="center"
          style={{ maxWidth: 350 }}
        >
          <TranslatedError error={error} field="title" />
        </Box>
        <Box
          color="palette.text.shade80"
          mt={4}
          fontSize={4}
          ff="Inter"
          textAlign="center"
          style={{ maxWidth: 350 }}
        >
          <TranslatedError error={error} field="description" />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <TrackPage category="Manager" name="FirmwareConfirmation" />
      <Box mx={7} color="positiveGreen" my={4}>
        <CheckCircle size={44} />
      </Box>
      <Title>{t("manager.modal.successTitle")}</Title>
      <Box mt={2} mb={5}>
        <Text ff="Inter|Regular" fontSize={4} color="palette.text.shade80">
          {t("manager.modal.successText")}
        </Text>
      </Box>
      <Box mx={7} />
    </Container>
  );
};

export const StepConfirmFooter = ({ onCloseModal }: StepProps) => {
  const { t } = useTranslation();
  return (
    <Button primary onClick={onCloseModal}>
      {t("common.close")}
    </Button>
  );
};

export default StepConfirmation;
