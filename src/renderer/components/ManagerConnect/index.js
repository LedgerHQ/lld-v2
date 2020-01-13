// @flow
import React, { useEffect } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import type { ListAppsResult } from "@ledgerhq/live-common/lib/apps/types";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { setPreferredDeviceModel } from "~/renderer/actions/settings";
import { preferredDeviceModelSelector } from "~/renderer/reducers/settings";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { Device } from "~/renderer/reducers/devices";
import Animation from "~/renderer/animations";
import TranslatedError from "~/renderer/components/TranslatedError";
import Spinner from "~/renderer/components/Spinner";
import AutoRepair from "~/renderer/components/AutoRepair";
import Button from "~/renderer/components/Button";
import ConnectTroubleshooting from "~/renderer/components/ConnectTroubleshooting";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import useTheme from "~/renderer/hooks/useTheme";
import { useManagerConnect } from "./logic";

const animations: { [k: DeviceModelId]: * } = {
  nanoX: {
    allowManager: {
      light: require("~/renderer/animations/nanoX/5AllowManager/light.json"),
      dark: require("~/renderer/animations/nanoX/5AllowManager/dark.json"),
    },
    plugAndPinCode: {
      light: require("~/renderer/animations/nanoX/1PlugAndPinCode/light.json"),
      dark: require("~/renderer/animations/nanoX/1PlugAndPinCode/dark.json"),
    },
    quitApp: {
      light: require("~/renderer/animations/nanoX/4QuitApp/light.json"),
      dark: require("~/renderer/animations/nanoX/4QuitApp/dark.json"),
    },
  },
  nanoS: {
    allowManager: {
      light: require("~/renderer/animations/nanoS/5AllowManager/light.json"),
      dark: require("~/renderer/animations/nanoS/5AllowManager/dark.json"),
    },
    plugAndPinCode: {
      light: require("~/renderer/animations/nanoS/1PlugAndPinCode/light.json"),
      dark: require("~/renderer/animations/nanoS/1PlugAndPinCode/dark.json"),
    },
    quitApp: {
      light: require("~/renderer/animations/nanoS/4QuitApp/light.json"),
      dark: require("~/renderer/animations/nanoS/4QuitApp/dark.json"),
    },
  },
};

export const getDeviceAnimation = (
  modelId: DeviceModelId,
  theme: "light" | "dark",
  key: string,
) => {
  const lvl1 = animations[modelId] || animations.nanoX;
  const lvl2 = lvl1[key] || animations.nanoX[key];
  if (!lvl2) throw new Error("no such animation " + key);
  return lvl2[theme] || lvl2.light;
};

type OwnProps = {
  overridesPreferredDeviceModel?: DeviceModelId,
  Success?: React$ComponentType<{
    device: Device,
    deviceInfo: DeviceInfo,
    result: ?ListAppsResult,
  }>,
};

type Props = OwnProps & {
  reduxDevice?: Device,
  preferredDeviceModel: DeviceModelId,
  dispatch: (*) => void,
};

const AnimationWrapper = styled.div`
  width: 600px;
  height: 200px;
  align-self: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Title = styled(Text).attrs({
  ff: "Inter|SemiBold",
  color: "palette.text.shade100",
  textAlign: "center",
  fontSize: 5,
})``;

const ManagerConnect = ({
  reduxDevice,
  Success,
  overridesPreferredDeviceModel,
  preferredDeviceModel,
  dispatch,
}: Props) => {
  const [
    {
      device,
      unresponsive,
      error,
      isLoading,
      allowManagerRequestedWording,
      inApp,
      result,
      deviceInfo,
      repairModalOpened,
    },
    { onRetry, onAutoRepair, closeRepairModal, onRepairModal },
  ] = useManagerConnect(reduxDevice);

  const type = useTheme("colors.palette.type");

  const modelId = device ? device.modelId : overridesPreferredDeviceModel || preferredDeviceModel;
  useEffect(() => {
    if (modelId !== preferredDeviceModel) {
      dispatch(setPreferredDeviceModel(modelId));
    }
  }, [modelId]);

  if (repairModalOpened && repairModalOpened.auto) {
    return <AutoRepair onDone={closeRepairModal} />;
  }

  if (inApp) {
    return (
      <Wrapper>
        <AnimationWrapper>
          <Animation animation={getDeviceAnimation(modelId, type, "quitApp")} />
        </AnimationWrapper>
        <Title>
          <Trans i18nKey="manager.connect.quitApp" />
        </Title>
      </Wrapper>
    );
  }

  if (allowManagerRequestedWording) {
    return (
      <Wrapper>
        <AnimationWrapper>
          <Animation animation={getDeviceAnimation(modelId, type, "allowManager")} />
        </AnimationWrapper>
        <Title>
          <Trans
            i18nKey="manager.connect.allowPermission"
            values={{ wording: allowManagerRequestedWording }}
          />
        </Title>
      </Wrapper>
    );
  }

  if (!isLoading && error) {
    return (
      <Wrapper>
        <Title>
          <TranslatedError error={error} />
        </Title>
        <Button mt={2} primary onClick={onRetry}>
          <Trans i18nKey="common.retry" />
        </Button>
      </Wrapper>
    );
  }

  if ((!isLoading && !device) || unresponsive) {
    return (
      <Wrapper>
        <div style={{ height: 120 }} />
        <AnimationWrapper>
          <Animation animation={getDeviceAnimation(modelId, type, "plugAndPinCode")} />
        </AnimationWrapper>
        <Title>
          <Trans i18nKey="manager.connect.connectAndUnlockDevice" />
        </Title>
        <div style={{ height: 120 }}>
          {!device ? (
            <ConnectTroubleshooting appearsAfterDelay={20000} onRepair={onRepairModal} />
          ) : null}
        </div>
      </Wrapper>
    );
  }

  if (isLoading) {
    return (
      <Wrapper>
        <Box horizontal style={{ height: 200 }} alignItems="center">
          <Spinner size={50} />
        </Box>
        <Title>
          <Trans i18nKey="manager.connect.loading" />
        </Title>
      </Wrapper>
    );
  }

  if (!deviceInfo || !device) {
    // this case should not happen because we are either loading or error
    return null;
  }

  if (deviceInfo.isBootloader) {
    return (
      <Wrapper>
        <Title>
          <Trans i18nKey="genuinecheck.deviceInBootloader" />
        </Title>
        <Button mt={2} primary onClick={onAutoRepair}>
          <Trans i18nKey="common.continue" />
        </Button>
      </Wrapper>
    );
  }

  return Success ? <Success device={device} deviceInfo={deviceInfo} result={result} /> : null;
};

const mapStateToProps = createStructuredSelector({
  reduxDevice: getCurrentDevice,
  preferredDeviceModel: preferredDeviceModelSelector,
});

const component: React$ComponentType<OwnProps> = connect(mapStateToProps)(ManagerConnect);

export default component;
