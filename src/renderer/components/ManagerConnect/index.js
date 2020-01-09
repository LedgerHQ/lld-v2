// @flow
import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import type { ListAppsResult } from "@ledgerhq/live-common/lib/apps/types";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { Device } from "~/renderer/reducers/devices";
import Animation from "~/renderer/animations";
import TranslatedError from "~/renderer/components/TranslatedError";
import BigSpinner from "~/renderer/components/BigSpinner";
import Text from "~/renderer/components/Text";
import nanoXAllowManager from "~/renderer/animations/nanoX/allowManager.json";
import nanoXPlugAndPinCode from "~/renderer/animations/nanoX/plugAndPinCode.json";
import nanoXQuitApp from "~/renderer/animations/nanoX/quitApp.json";
import { useManagerConnect } from "./logic";

const animations: { [k: DeviceModelId]: * } = {
  nanoX: {
    allowManager: nanoXAllowManager,
    plugAndPinCode: nanoXPlugAndPinCode,
    quitApp: nanoXQuitApp,
  },
};

type OwnProps = {
  Success?: React$ComponentType<{
    device: Device,
    deviceInfo: DeviceInfo,
    result: ?ListAppsResult,
  }>,
};

type Props = OwnProps & {
  reduxDevice?: Device,
};

const AnimationWrapper = styled.div`
  width: 600px;
  height: 350px;
  align-self: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ManagerConnect = ({ reduxDevice, Success }: Props) => {
  const [
    { device, error, isLoading, allowManagerRequestedWording, inApp, result, deviceInfo },
    { onRetry },
  ] = useManagerConnect(reduxDevice);

  const defaultModelId = "nanoX"; // TODO we will store in redux the last preferred device model used to infer here the correct one
  const animation = animations[device ? device.modelId : defaultModelId] || animations.nanoX; // fallback nanoX in case not defined

  if (inApp) {
    return (
      <Wrapper>
        <AnimationWrapper>
          <Animation animation={animation.quitApp} />
        </AnimationWrapper>
        Device is not in dashboard
      </Wrapper>
    );
  }

  if (allowManagerRequestedWording) {
    return (
      <Wrapper>
        <AnimationWrapper>
          <Animation animation={animation.allowManager} />
        </AnimationWrapper>
        <h2>Please {allowManagerRequestedWording}</h2>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <TranslatedError error={error} />
        <button onClick={onRetry}>RETRY (UI todo)</button>
      </Wrapper>
    );
  }

  if (isLoading) {
    return (
      <Wrapper>
        <BigSpinner size={50} />
        <Text
          mt={60}
          ff="Inter|Regular"
          color="palette.text.shade100"
          textAlign="center"
          fontSize={5}
        >
          <Trans i18nKey="manager.connect.loading" />
        </Text>
      </Wrapper>
    );
  }

  if (!device) {
    return (
      <Wrapper>
        <AnimationWrapper>
          <Animation animation={animation.plugAndPinCode} />
        </AnimationWrapper>
        <Text ff="Inter|Regular" color="palette.text.shade100" textAlign="center" fontSize={5}>
          <Trans i18nKey="manager.connect.connectAndUnlockDevice" />
        </Text>
      </Wrapper>
    );
  }

  if (!deviceInfo) {
    // this case should not happen because we are either loading or error
    return null;
  }

  if (deviceInfo.isBootloader) {
    return (
      <Wrapper>
        <Text ff="Inter|Regular" color="palette.text.shade100" textAlign="center" fontSize={5}>
          BOOTLOADER CASE TODO
        </Text>
      </Wrapper>
    );
  }

  return Success ? <Success device={device} deviceInfo={deviceInfo} result={result} /> : null;
};

const mapStateToProps = createStructuredSelector({
  reduxDevice: getCurrentDevice,
});

const component: React$ComponentType<OwnProps> = connect(mapStateToProps)(ManagerConnect);

export default component;
