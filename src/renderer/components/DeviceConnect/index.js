// @flow
import React, { useEffect, Component } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { WrongDeviceForAccount } from "@ledgerhq/errors";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { setPreferredDeviceModel } from "~/renderer/actions/settings";
import { preferredDeviceModelSelector } from "~/renderer/reducers/settings";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { Device } from "~/renderer/reducers/devices";
import Animation from "~/renderer/animations";
import BigSpinner from "~/renderer/components/BigSpinner";
import AutoRepair from "~/renderer/components/AutoRepair";
import Button from "~/renderer/components/Button";
import TranslatedError from "~/renderer/components/TranslatedError";
import ConnectTroubleshooting from "~/renderer/components/ConnectTroubleshooting";
import Text from "~/renderer/components/Text";
import useTheme from "~/renderer/hooks/useTheme";
import ErrorDisplay from "../ErrorDisplay";
import { getDeviceAnimation } from "./animations";
import type { Config } from "./configs/shared";

type OwnProps<R, H, P> = {
  overridesPreferredDeviceModel?: DeviceModelId,
  Success?: React$ComponentType<P>,
  onSuccess?: P => void,
  config: Config<R, H, P>,
  request: R,
};

type Props<R, H, P> = OwnProps<R, H, P> & {
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
  display: flex;
  flex: 1 0 0%;
  flex-direction: column;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
`;

const Footer = styled.div`
  display: flex;
  flex: 1 0 0%;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
`;

const TroobleshootingWrapper = styled.div`
  margin-top: auto;
`;

class OnSuccess extends Component<*> {
  componentDidMount() {
    const { onSuccess, ...rest } = this.props;
    onSuccess(rest);
  }

  render() {
    return null;
  }
}

const DeviceConnect = <R, H, P>({
  Success,
  onSuccess,
  reduxDevice,
  overridesPreferredDeviceModel,
  preferredDeviceModel,
  dispatch,
  // $FlowFixMe god of flow help me
  config,
  request,
}: Props<R, H, P>) => {
  const hookState = config.useHook(reduxDevice, request);
  const {
    device,
    unresponsive,
    error,
    isLoading,
    allowManagerRequestedWording,
    requestQuitApp,
    deviceInfo,
    repairModalOpened,
    requestOpenApp,
    allowOpeningRequestedWording,
    requiresAppInstallation,
    inWrongDeviceForAccount,
    onRetry,
    onAutoRepair,
    closeRepairModal,
    onRepairModal,
  } = hookState;

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

  if (requestOpenApp) {
    // In case of a Nano S 1.3.1 this will be used.
    // TODO design / wording
    return (
      <Wrapper>
        <Header />
        <AnimationWrapper modelId={modelId}>
          <Animation animation={getDeviceAnimation(modelId, type, "openApp")} />
        </AnimationWrapper>
        <Footer>
          <Title>Please open {requestOpenApp} app</Title>
        </Footer>
      </Wrapper>
    );
  }

  if (requestQuitApp) {
    return (
      <Wrapper>
        <Header />
        <AnimationWrapper modelId={modelId}>
          <Animation animation={getDeviceAnimation(modelId, type, "quitApp")} />
        </AnimationWrapper>
        <Footer>
          <Title>
            <Trans i18nKey="manager.connect.quitApp" />
          </Title>
        </Footer>
      </Wrapper>
    );
  }

  if (requiresAppInstallation) {
    return (
      <Wrapper>
        <Title>{requiresAppInstallation.appName} App is not yet installed</Title>
        <Button
          mt={2}
          primary
          onClick={() => {
            /* TODO */
          }}
        >
          Open Manager
        </Button>
      </Wrapper>
    );
  }

  if (allowManagerRequestedWording) {
    return (
      <Wrapper>
        <Header />
        <AnimationWrapper modelId={modelId}>
          <Animation animation={getDeviceAnimation(modelId, type, "allowManager")} />
        </AnimationWrapper>
        <Footer>
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

  if (allowOpeningRequestedWording) {
    return (
      <Wrapper>
        <Header />
        <AnimationWrapper modelId={modelId}>
          <Animation animation={getDeviceAnimation(modelId, type, "openApp")} />
        </AnimationWrapper>
        <Footer>
          <Title>
            <Trans
              i18nKey="appconnect.allowPermission"
              values={{ wording: allowOpeningRequestedWording }}
            />
          </Title>
        </Footer>
      </Wrapper>
    );
  }

  if (inWrongDeviceForAccount) {
    return (
      <Wrapper>
        <Title>
          <TranslatedError error={new WrongDeviceForAccount()} />
        </Title>
        <Button mt={2} primary onClick={onRetry}>
          <Trans i18nKey="common.retry" />
        </Button>
      </Wrapper>
    );
  }

  if (!isLoading && error) {
    return <ErrorDisplay error={error} onRetry={onRetry} withExportLogs />;
  }

  if ((!isLoading && !device) || unresponsive) {
    return (
      <Wrapper>
        <Header />
        <AnimationWrapper modelId={modelId}>
          <Animation
            animation={getDeviceAnimation(
              modelId,
              type,
              unresponsive ? "enterPinCode" : "plugAndPinCode",
            )}
          />
        </AnimationWrapper>
        <Footer>
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
        <Header />
        <AnimationWrapper modelId={modelId}>
          <BigSpinner size={50} />
        </AnimationWrapper>
        <Footer>
          <Title>
            <Trans i18nKey="manager.connect.loading" />
          </Title>
        </Footer>
      </Wrapper>
    );
  }

  if (deviceInfo && deviceInfo.isBootloader) {
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

  const payload = config.mapSuccess(hookState);

  if (!payload) {
    return null;
  }

  return (
    <>
      {Success ? <Success {...payload} /> : null}
      {onSuccess ? <OnSuccess onSuccess={onSuccess} {...payload} /> : null}
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  reduxDevice: getCurrentDevice,
  preferredDeviceModel: preferredDeviceModelSelector,
});

const component: React$ComponentType<OwnProps<*, *, *>> = connect(mapStateToProps)(DeviceConnect);

export default component;
