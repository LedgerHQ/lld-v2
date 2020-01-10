// @flow

import React, { PureComponent } from "react";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import styled from "styled-components";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { T } from "~/types/common";
import type { OnboardingState } from "~/renderer/reducers/onboarding";
import type { SettingsState } from "~/renderer/reducers/settings";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { onboardingRelaunchedSelector } from "~/renderer/reducers/onboarding";
import {
  nextStep,
  prevStep,
  jumpStep,
  updateGenuineCheck,
  deviceModelId,
  flowType,
  relaunchOnboarding,
} from "~/renderer/actions/onboarding";
import { saveSettings } from "~/renderer/actions/settings";
import { openModal } from "~/renderer/actions/modals";
import { unlock } from "~/renderer/actions/application";
import Box from "~/renderer/components/Box";
import ManagerConnect from "~/renderer/components/ManagerConnect";
import IconCross from "~/renderer/icons/Cross";
import Start from "./steps/Start";
import InitStep from "./steps/Init";
import NoDeviceStep from "./steps/NoDevice";
import OnboardingBreadcrumb from "./OnboardingBreadcrumb";
import SelectDevice from "./steps/SelectDevice";
import SelectPIN from "./steps/SelectPIN/index";
import WriteSeed from "./steps/WriteSeed/index";
import SetPassword from "./steps/SetPassword";
import Analytics from "./steps/Analytics";
import Finish from "./steps/Finish";
import GrowScroll from "~/renderer/components/GrowScroll";

const STEPS = {
  init: InitStep,
  selectDevice: SelectDevice,
  selectPIN: SelectPIN,
  writeSeed: WriteSeed,
  genuineCheck: ManagerConnect,
  setPassword: SetPassword,
  analytics: Analytics,
  finish: Finish,
  start: Start,
  noDevice: NoDeviceStep,
};

const mapStateToProps = state => ({
  hasCompletedOnboarding: state.settings.hasCompletedOnboarding,
  onboardingRelaunched: onboardingRelaunchedSelector(state),
  onboarding: state.onboarding,
  settings: state.settings,
  getCurrentDevice: getCurrentDevice(state),
});

const mapDispatchToProps = {
  saveSettings,
  nextStep,
  prevStep,
  jumpStep,
  unlock,
  openModal,
  relaunchOnboarding,
};

type Props = {
  t: T,
  hasCompletedOnboarding: boolean,
  onboardingRelaunched: boolean,
  saveSettings: Function,
  onboarding: OnboardingState,
  settings: SettingsState,
  prevStep: Function,
  nextStep: Function,
  jumpStep: Function,
  getCurrentDevice: Function,
  unlock: Function,
  openModal: string => void,
  relaunchOnboarding: boolean => void,
};

export type StepProps = {
  t: T,
  onboarding: OnboardingState,
  settings: SettingsState,
  prevStep: Function,
  nextStep: Function,
  jumpStep: Function,
  finish: Function,
  saveSettings: Function,
  savePassword: Function,
  getDeviceInfo: Function,
  updateGenuineCheck: Function,
  openModal: Function,
  deviceModelId: DeviceModelId => *,
  flowType: Function,
};

const CloseContainer = styled(Box).attrs(() => ({
  p: 4,
  color: "palette.divider",
}))`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;

  &:hover {
    color: ${p => p.theme.colors.palette.text.shade60};
  }

  &:active {
    color: ${p => p.theme.colors.palette.text.shade100};
  }
`;

class OnboardingC extends PureComponent<Props> {
  getDeviceInfo = () => this.props.getCurrentDevice;
  cancelRelaunch = () => {
    this.props.relaunchOnboarding(false);
  };

  finish = () => {
    this.props.saveSettings({ hasCompletedOnboarding: true });
    this.props.relaunchOnboarding(false);
  };

  savePassword = hash => {
    this.props.saveSettings({
      password: {
        isEnabled: hash !== undefined,
        value: hash,
      },
    });
    this.props.unlock();
  };

  render() {
    const {
      onboarding,
      prevStep,
      nextStep,
      jumpStep,
      settings,
      t,
      onboardingRelaunched,
    } = this.props;

    const StepComponent = STEPS[onboarding.stepName];
    const step = onboarding.steps[onboarding.stepIndex];

    if (!StepComponent || !step) {
      console.warn(`You reached an impossible onboarding step.`); // eslint-disable-line
      return null;
    }

    const stepProps: StepProps = {
      t,
      onboarding,
      settings,
      updateGenuineCheck,
      openModal,
      deviceModelId,
      flowType,
      prevStep,
      nextStep,
      jumpStep,
      finish: this.finish,
      savePassword: this.savePassword,
      getDeviceInfo: this.getDeviceInfo,
      saveSettings,
    };

    return (
      <Container>
        {step.options.showBreadcrumb && <OnboardingBreadcrumb />}
        {onboardingRelaunched ? (
          <CloseContainer onClick={this.cancelRelaunch}>
            <IconCross size={16} />
          </CloseContainer>
        ) : null}
        <StepContainer>
          <StepComponent {...stepProps} />
        </StepContainer>
      </Container>
    );
  }
}

const Onboarding: React$ComponentType<{}> = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(OnboardingC);

export default Onboarding;

const Container = styled(Box).attrs(() => ({
  p: 60,
  selectable: true,
}))`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 25;
  background-color: ${p => p.theme.colors.palette.background.paper};
  transition: background-color ease-out 300ms;
  transition-delay: 300ms;
`;
const StepContainer = styled(Box).attrs(() => ({
  p: 40,
}))``;

export const Title = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  fontSize: 7,
  color: "palette.text.shade100",
}))`
  max-width: 550px;
  text-align: center;
  transition: color ease-out 300ms;
  transition-delay: 300ms;
  margin-top: 40px;
  margin-bottom: 20px;
`;

export const Description = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: 5,
  lineHeight: 1.5,
  textAlign: "center",
  color: "palette.text.shade60",
}))`
  transition: color ease-out 300ms;
  transition-delay: 300ms;
  margin: 10px auto 25px;
  max-width: 480px;
`;

export const FixedTopContainer = styled(Box).attrs(() => ({
  sticky: true,
  mt: 170,
}))``;

export const StepContainerInner = styled(GrowScroll).attrs(() => ({
  pb: 6,
  alignItems: "center",
}))``;

export const Inner = styled(Box).attrs(() => ({
  horizontal: true,
  grow: true,
  flow: 4,
}))``;

export const IconOptionRow = styled(Box).attrs(p => ({
  ff: "Inter|Regular",
  fontSize: 14,
  color: p.color || "wallet",
}))``;
