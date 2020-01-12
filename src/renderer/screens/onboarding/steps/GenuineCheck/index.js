// @flow

import React from "react";
import { FixedTopContainer, Title } from "../../sharedComponents";
import OnboardingFooter from "../../OnboardingFooter";
import type { StepProps } from "../..";
import GrowScroll from "~/renderer/components/GrowScroll";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";

const GenuineCheck = (props: StepProps) => {
  const { nextStep, prevStep, t } = props;

  return (
    <FixedTopContainer>
      <GrowScroll pb={7}>
        <TrackPage category="Onboarding" name="Genuine Check" />
        <Box grow alignItems="center">
          <Title>{t("onboarding.genuineCheck.title")}</Title>
          <Text>Implement me</Text>
        </Box>
      </GrowScroll>
      <OnboardingFooter
        horizontal
        alignItems="center"
        flow={2}
        t={t}
        nextStep={nextStep}
        prevStep={prevStep}
      />
    </FixedTopContainer>
  );
};

export default GenuineCheck;
