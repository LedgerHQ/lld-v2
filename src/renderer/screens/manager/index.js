// @flow
import React, { useCallback, useState } from "react";
import ManagerConnect from "~/renderer/screens/manager/ManagerConnect";
import HookDeviceChange from "~/renderer/screens/manager/HookDeviceChange";
import Dashboard from "~/renderer/screens/manager/Dashboard";

const Manager = () => {
  const [connectResult, setConnectResult] = useState(null);

  const resetState = useCallback(() => {
    setConnectResult(null);
  }, []);

  const onConnect = useCallback(connectResult => {
    setConnectResult(connectResult);
  }, []);

  if (!connectResult) {
    return <ManagerConnect onSuccess={onConnect} />;
  }

  return (
    <>
      <HookDeviceChange onDeviceChanges={resetState} onDeviceDisconnected={resetState} />
      <Dashboard {...connectResult} />
    </>
  );
};

export default Manager;
