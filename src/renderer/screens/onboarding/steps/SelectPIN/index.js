// @flow
import React from "react";
import styled from "styled-components";
import { FixedTopContainer, OptionRow, Title } from "~/renderer/screens/onboarding";
import { getDeviceModel } from "@ledgerhq/devices";
import TrackPage from "~/renderer/analytics/TrackPage";
import GrowScroll from "~/renderer/components/GrowScroll";
import Box from "~/renderer/components/Box";
import OnboardingFooter from "~/renderer/screens/onboarding/OnboardingFooter";
import SelectPINblue from "~/renderer/screens/onboarding/steps/SelectPIN/SelectPINblue";
import SelectPINRestoreNanoX from "~/renderer/screens/onboarding/steps/SelectPIN/SelectPINRestoreNanoX";
import SelectPINrestoreBlue from "~/renderer/screens/onboarding/steps/SelectPIN/SelectPINrestoreBlue";
import SelectPINnano from "~/renderer/screens/onboarding/steps/SelectPIN/SelectPINnano";
import SelectPINrestoreNano from "~/renderer/screens/onboarding/steps/SelectPIN/SelectPINrestoreNano";
import SelectPINnanoX from "~/renderer/screens/onboarding/steps/SelectPIN/SelectPINnanoX";
import IconSensitiveOperationShield from "~/renderer/icons/SensitiveOperationShield";

const SelectPin = ({ modelId, restore = false }: { modelId: DeviceModelId, restore?: boolean }) => {
  switch (modelId) {
    case "nanoX":
      return restore ? <SelectPINRestoreNanoX /> : <SelectPINnanoX />;
    case "blue":
      return restore ? <SelectPINrestoreBlue /> : <SelectPINblue />;
    default:
      return restore ? <SelectPINrestoreNano /> : <SelectPINnano />;
  }
};

export default (props: StepProps) => {
  const { nextStep, prevStep, t, onboarding } = props;

  const model = getDeviceModel(onboarding.deviceModelId || "nanoS");

  return (
    <FixedTopContainer>
      <GrowScroll pb={7}>
        <TrackPage
          category="Onboarding"
          name="Choose PIN"
          flowType={onboarding.flowType}
          deviceType={model.productName}
        />
        {onboarding.flowType === "restoreDevice" ? (
          <Box grow alignItems="center">
            <Title>{t("onboarding.selectPIN.restore.title")}</Title>
            <Box align="center" mt={7}>
              <SelectPin modelId={model.id} restore />
            </Box>
          </Box>
        ) : (
          <Box grow alignItems="center">
            <Title>{t("onboarding.selectPIN.initialize.title")}</Title>
            <Box align="center" mt={7}>
              <SelectPin modelId={model.id} />
            </Box>
          </Box>
        )}
      </GrowScroll>
      <OnboardingFooter horizontal flow={2} t={t} nextStep={nextStep} prevStep={prevStep} />
    </FixedTopContainer>
  );
};

// FIXME MOVE THIS OUT OF HERE
const DisclaimerBoxContainer = styled(Box).attrs(() => ({
  shrink: 1,
  grow: true,
  borderRadius: "4px",
  bg: "palette.background.default",
}))`
  min-width: 620px;
  border: 1px dashed ${p => p.theme.colors.palette.divider};
`;

const DisclaimerBoxIconContainer = styled(Box).attrs(p => ({
  color: p.theme.colors.alertRed,
}))`
  position: absolute;
  top: 0;
  right: 0;
`;

export function DisclaimerBox({ disclaimerNotes, ...p }: { disclaimerNotes: any }) {
  return (
    <DisclaimerBoxContainer {...p}>
      <Box m={3} relative>
        <DisclaimerBoxIconContainer>
          <IconSensitiveOperationShield />
        </DisclaimerBoxIconContainer>
        {disclaimerNotes.map(note => (
          <OptionRow justify="center" key={note.key} step={note} />
        ))}
      </Box>
    </DisclaimerBoxContainer>
  );
}
