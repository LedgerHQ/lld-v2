// @flow
import React, { Fragment, useState, useEffect } from "react";
import { createStructuredSelector } from "reselect";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { connect } from "react-redux";
import { command } from "~/renderer/commands";
import Spinner from "~/renderer/components/Spinner";
import Dashboard from "~/renderer/screens/manager/Dashboard";
import type { Device } from "~/renderer/reducers/devices";
import type { ManagerConnectState } from "~/internal/commands/connectManager";

type Props = {
  device?: Device,
};

const Manager = ({ device }: Props) => {
  const initialState: ManagerConnectState = {
    device,
    allowManagerRequested: false,
    allowManagerGranted: false,
  };

  const [connectResult, setConnectResult] = useState(initialState);
  const [error, setError] = useState(null);
  const { allowManagerRequested, allowManagerGranted, listAppsRes, deviceInfo } = connectResult;

  useEffect(() => {
    if (device) {
      setError(null);
      const sub = command("connectManager")({ devicePath: device.path }).subscribe({
        next: (next: ManagerConnectState) => setConnectResult(next),
        error: error => setError(error),
      });

      return () => sub.unsubscribe();
    } else {
      setConnectResult(initialState);
      setError(null);
    }
  }, [device]);

  return (
    <Fragment>
      {device ? (
        error ? (
          <div>
            <h2>Error</h2>
            <span>{error.message}</span>
          </div>
        ) : listAppsRes ? (
          <div>
            <Dashboard device={device} deviceInfo={deviceInfo} listAppsRes={listAppsRes} />
          </div>
        ) : allowManagerRequested ? (
          allowManagerGranted ? (
            <h2>Manager permission granted</h2>
          ) : (
            <h2>Manager permission requested</h2>
          )
        ) : (
          <div>
            <h2>Loading</h2>
            <Spinner size={60} />
          </div>
        )
      ) : (
        <h2>Connect your device</h2>
      )}
    </Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  device: getCurrentDevice,
});

const ConnectedManager: React$ComponentType<Props> = connect(mapStateToProps)(Manager);

export default ConnectedManager;
