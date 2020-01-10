// @flow
import React from "react";
import Box from "~/renderer/components/Box";
import TrackPage from "~/renderer/analytics/TrackPage";
import type { StepProps } from "~/renderer/screens/onboarding";
import LedgerLiveImg from "~/renderer/images/ledgerlive-logo.svg";
import LedgerLiveLogo from "~/renderer/components/LedgerLiveLogo";
import { Trans } from "react-i18next";
import ThemeSelector from "~/renderer/screens/onboarding/steps/ThemeSelector";
import Button from "~/renderer/components/Button";
import { Description, Title } from "~/renderer/screens/onboarding";

const Start = (props: StepProps) => {
  const { jumpStep } = props;
  return (
    <Box sticky justifyContent="center">
      <TrackPage category="Onboarding" name="Start" />
      <Box alignItems="center">
        <LedgerLiveLogo
          icon={<img src={LedgerLiveImg} alt="" draggable="false" width={50} height={50} />}
        />
        <Box>
          <Title>
            <Trans i18nKey="onboarding.start.title" />
          </Title>
        </Box>
        <Box>
          <Description>
            <Trans i18nKey="onboarding.start.themeDesc" />
          </Description>
        </Box>
        <ThemeSelector />
        <Button primary onClick={() => jumpStep("init")}>
          <Trans i18nKey="onboarding.start.startBtn" />
        </Button>
      </Box>
    </Box>
  );
};
export default Start;
