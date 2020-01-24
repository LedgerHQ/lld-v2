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
import BigSpinner from "~/renderer/components/BigSpinner";
import AutoRepair from "~/renderer/components/AutoRepair";
import Button from "~/renderer/components/Button";
import ConnectTroubleshooting from "~/renderer/components/ConnectTroubleshooting";
import Text from "~/renderer/components/Text";
import useTheme from "~/renderer/hooks/useTheme";
import { useManagerConnect } from "./logic";
import ErrorDisplay from "../ErrorDisplay";

const animations: { [k: DeviceModelId]: * } = {
  nanoX: {
    plugAndPinCode: {
      light: require("~/renderer/animations/nanoX/1PlugAndPinCode/light.json"),
      dark: require("~/renderer/animations/nanoX/1PlugAndPinCode/dark.json"),
    },
    enterPinCode: {
      light: require("~/renderer/animations/nanoX/3EnterPinCode/light.json"),
      dark: require("~/renderer/animations/nanoX/3EnterPinCode/dark.json"),
    },
    quitApp: {
      light: require("~/renderer/animations/nanoX/4QuitApp/light.json"),
      dark: require("~/renderer/animations/nanoX/4QuitApp/dark.json"),
    },
    allowManager: {
      light: require("~/renderer/animations/nanoX/5AllowManager/light.json"),
      dark: require("~/renderer/animations/nanoX/5AllowManager/dark.json"),
    },
  },
  nanoS: {
    plugAndPinCode: {
      light: require("~/renderer/animations/nanoS/1PlugAndPinCode/light.json"),
      dark: require("~/renderer/animations/nanoS/1PlugAndPinCode/dark.json"),
    },
    enterPinCode: {
      light: require("~/renderer/animations/nanoS/3EnterPinCode/light.json"),
      dark: require("~/renderer/animations/nanoS/3EnterPinCode/dark.json"),
    },
    quitApp: {
      light: require("~/renderer/animations/nanoS/4QuitApp/light.json"),
      dark: require("~/renderer/animations/nanoS/4QuitApp/dark.json"),
    },
    allowManager: {
      light: require("~/renderer/animations/nanoS/5AllowManager/light.json"),
      dark: require("~/renderer/animations/nanoS/5AllowManager/dark.json"),
    },
  },
  blue: {
    plugAndPinCode: {
      light: require("~/renderer/animations/blue/1PlugAndPinCode/data.json"),
    },
    enterPinCode: {
      light: require("~/renderer/animations/blue/3EnterPinCode/data.json"),
    },
    quitApp: {
      light: require("~/renderer/animations/blue/4QuitApp/data.json"),
    },
    allowManager: {
      light: require("~/renderer/animations/blue/5AllowManager/data.json"),
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
  edges?: number,
  overridesPreferredDeviceModel?: DeviceModelId,
  Success: React$ComponentType<{
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
  height: ${p => (p.modelId === "blue" ? "300px" : "200px")};
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
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

const Header = styled.div`
  min-height: ${p => p.edges || 0}px;
`;

const Footer = styled.div`
  min-height: ${p => p.edges || 0}px;
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-bottom: 40px;
`;

const TroobleshootingWrapper = styled.div`
  margin-top: auto;
`;

const ManagerConnect = ({
  reduxDevice,
  Success,
  overridesPreferredDeviceModel,
  preferredDeviceModel,
  dispatch,
  edges,
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
  }, [dispatch, modelId, preferredDeviceModel]);

  if (repairModalOpened && repairModalOpened.auto) {
    return <AutoRepair onDone={closeRepairModal} />;
  }

  if (inApp) {
    return (
      <Wrapper>
        <Header edges={edges} />
        <AnimationWrapper modelId={modelId}>
          <Animation animation={getDeviceAnimation(modelId, type, "quitApp")} />
        </AnimationWrapper>
        <Footer edges={edges}>
          <Title>
            <Trans i18nKey="manager.connect.quitApp" />
          </Title>
        </Footer>
      </Wrapper>
    );
  }

  if (allowManagerRequestedWording) {
    return (
      <Wrapper>
        <Header edges={edges} />
        <AnimationWrapper modelId={modelId}>
          <Animation animation={getDeviceAnimation(modelId, type, "allowManager")} />
        </AnimationWrapper>
        <Footer edges={edges}>
          <Title>
            <Trans
              i18nKey="manager.connect.allowPermission"
              values={{ wording: allowManagerRequestedWording }}
            />
          </Title>
        </Footer>
      </Wrapper>
    );
  }

  if (!isLoading && error) {
    return <ErrorDisplay error={error} onRetry={onRetry} withExportLogs />;
  }

  if ((!isLoading && !device) || unresponsive) {
    return (
      <Wrapper>
        <Header edges={edges} />
        <AnimationWrapper modelId={modelId}>
          <Animation
            animation={getDeviceAnimation(
              modelId,
              type,
              unresponsive ? "enterPinCode" : "plugAndPinCode",
            )}
          />
        </AnimationWrapper>
        <Footer edges={edges}>
          <Title>
            <Trans
              i18nKey={
                unresponsive
                  ? "manager.connect.unlockDevice"
                  : "manager.connect.connectAndUnlockDevice"
              }
            />
          </Title>
          {!device ? (
            <TroobleshootingWrapper>
              <ConnectTroubleshooting onRepair={onRepairModal} />
            </TroobleshootingWrapper>
          ) : null}
        </Footer>
      </Wrapper>
    );
  }

  if (isLoading) {
    return (
      <Wrapper>
        <Header edges={edges} />
        <AnimationWrapper modelId={modelId}>
          <BigSpinner size={50} />
        </AnimationWrapper>
        <Footer edges={edges}>
          <Title>
            <Trans i18nKey="manager.connect.loading" />
          </Title>
        </Footer>
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
