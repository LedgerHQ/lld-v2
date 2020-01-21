// @flow
import React, { Component, useEffect } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { WrongDeviceForAccount } from "@ledgerhq/errors";
import type { AppAndVersion } from "~/internal/commands/connectApp";
import type { Account, CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { setPreferredDeviceModel } from "~/renderer/actions/settings";
import { preferredDeviceModelSelector } from "~/renderer/reducers/settings";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { Device } from "~/renderer/reducers/devices";
import Animation from "~/renderer/animations";
import TranslatedError from "~/renderer/components/TranslatedError";
import BigSpinner from "~/renderer/components/BigSpinner";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import useTheme from "~/renderer/hooks/useTheme";
import { useAppConnect } from "./logic";

// NB maybe we could unify AppConnect rendering and ManagerConnect rendering. but not for now.

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
    allowOpening: {
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
    allowOpening: {
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
    allowOpening: {
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

export type Payload = {
  device: Device,
  appAndVersion: ?AppAndVersion,
};

type OwnProps = {
  edges?: number,
  Success?: React$ComponentType<Payload>,
  onSuccess?: Payload => void,
  currency?: ?CryptoCurrency,
  account?: ?Account,
  appName?: ?string,
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

const AppConnect = ({
  reduxDevice,
  Success,
  onSuccess,
  preferredDeviceModel,
  dispatch,
  edges,
  account,
  currency,
  appName,
}: Props) => {
  const appRequest = { account, currency, appName };
  const [
    {
      device,
      unresponsive,
      error,
      isLoading,
      allowOpeningRequestedWording,
      requestQuitApp,
      requestOpenApp,
      appAndVersion,
      requiresAppInstallation,
      opened,
      inWrongDeviceForAccount,
    },
    { onRetry },
  ] = useAppConnect(reduxDevice, appRequest);

  const type = useTheme("colors.palette.type");

  const modelId = device ? device.modelId : preferredDeviceModel;
  useEffect(() => {
    if (modelId !== preferredDeviceModel) {
      dispatch(setPreferredDeviceModel(modelId));
    }
  }, [dispatch, modelId, preferredDeviceModel]);

  if (requestOpenApp) {
    // In case of a Nano S 1.3.1 this will be used.
    // TODO design / wording
    return (
      <Wrapper>
        <Header edges={edges} />
        <Footer edges={edges}>
          <Title>Please open {requestOpenApp} app</Title>
        </Footer>
      </Wrapper>
    );
  }

  if (requestQuitApp) {
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

  if (allowOpeningRequestedWording) {
    return (
      <Wrapper>
        <Header edges={edges} />
        <AnimationWrapper modelId={modelId}>
          <Animation animation={getDeviceAnimation(modelId, type, "allowOpening")} />
        </AnimationWrapper>
        <Footer edges={edges}>
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

  if (!opened || !device) {
    // this case should not happen because we are either loading or error
    return null;
  }

  return (
    <>
      {Success ? <Success device={device} appAndVersion={appAndVersion} /> : null}
      {onSuccess ? (
        <OnSuccess onSuccess={onSuccess} device={device} appAndVersion={appAndVersion} />
      ) : null}
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  reduxDevice: getCurrentDevice,
  preferredDeviceModel: preferredDeviceModelSelector,
});

const component: React$ComponentType<OwnProps> = connect(mapStateToProps)(AppConnect);

export default component;
