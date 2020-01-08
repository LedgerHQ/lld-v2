// @flow
import React, { Fragment, useState, useEffect } from "react";
import { createStructuredSelector } from "reselect";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { connect } from "react-redux";
import { command } from "~/renderer/commands";
import Animation from "~/renderer/animations";
import styled from "styled-components";
import BigSpinner from "~/renderer/components/BigSpinner";
import Dashboard from "~/renderer/screens/manager/Dashboard";
import type { Device } from "~/renderer/reducers/devices";
import type { ManagerConnectState } from "~/internal/commands/connectManager";
import { Trans } from "react-i18next";
import Text from "~/renderer/components/Text";

type Props = {
  device?: Device,
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

const Manager = ({ device }: Props) => {
  const initialState: ManagerConnectState = {
    device,
    allowManagerRequested: false,
    allowManagerGranted: false,
    deviceInDashboard: true,
    isLoading: false,
  };

  const [connectResult, setConnectResult] = useState(initialState);
  const [error, setError] = useState(null);
  const {
    allowManagerRequested,
    allowManagerGranted,
    deviceInDashboard,
    listAppsRes,
    deviceInfo,
  } = connectResult;

  useEffect(() => {
    if (device) {
      setError(null);
      const sub = command("connectManager")({ devicePath: device.path }).subscribe({
        next: (next: ManagerConnectState) => {
          setConnectResult(next);
        },
        error: error => {
          setError(error);
        },
      });

      return () => sub.unsubscribe();
    } else {
      setConnectResult(initialState);
      setError(null);
    }
  }, [device]);

  // console.log({
  //   device: !!device,
  //   deviceInfo: !!deviceInfo,
  //   isLoading,
  //   deviceInDashboard,
  //   allowManagerRequested,
  //   allowManagerGranted,
  // });

  return (
    <Fragment>
      {!device ? (
        <Wrapper>
          <AnimationWrapper>
            <Animation name="connectDeviceEnterPinNanoX" />
          </AnimationWrapper>
          <Text ff="Inter|Regular" color="palette.text.shade100" align="center" fontSize={5}>
            <Trans i18nKey="manager.connect.connectAndUnlockDevice" />
          </Text>
        </Wrapper>
      ) : error ? (
        <Wrapper>{error.message}</Wrapper>
      ) : !deviceInDashboard ? (
        <Wrapper>Device is not in dashboard</Wrapper>
      ) : listAppsRes && deviceInfo ? (
        <Dashboard device={device} deviceInfo={deviceInfo} listAppsRes={listAppsRes} />
      ) : allowManagerRequested && !allowManagerGranted ? (
        <Wrapper>
          <h2>Manager permission requested</h2>
        </Wrapper>
      ) : (
        <Wrapper>
          <BigSpinner size={50} />
          <Text
            mt={60}
            ff="Inter|Regular"
            color="palette.text.shade100"
            align="center"
            fontSize={5}
          >
            <Trans i18nKey="manager.connect.loading" />
          </Text>
        </Wrapper>
      )}
    </Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  device: getCurrentDevice,
});

const ConnectedManager: React$ComponentType<Props> = connect(mapStateToProps)(Manager);

export default ConnectedManager;
