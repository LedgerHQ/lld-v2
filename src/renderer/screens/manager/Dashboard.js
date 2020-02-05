// @flow
import React, { useCallback, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import type { ListAppsResult } from "@ledgerhq/live-common/lib/apps/types";
import type { Device } from "~/renderer/reducers/devices";
import AppsList from "./AppsList";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import { command } from "~/renderer/commands";
import FirmwareUpdate from "./FirmwareUpdate";
import { getCurrentDevice } from "~/renderer/reducers/devices";

type Props = {
  device: Device,
  deviceInfo: DeviceInfo,
  result: ?ListAppsResult,
  onReset?: () => void,
};

const Dashboard = ({ device, deviceInfo, result, onReset }: Props) => {
  /** locks and unlocks the device connection state reset ie: firmware update */
  const [resetLock, setResetLock] = useState(false);
  const lockReset = useCallback(() => setResetLock(true), [setResetLock]);
  const unlockReset = useCallback(() => setResetLock(false), [setResetLock]);
  /** we listen to the redux state to detect the current device connected */
  const currentDevice = useSelector(getCurrentDevice);
  /**
   * if we did not lock reset ie: not firmware update
   * and if we detect that the device is disconnected we reset the parent manager connect state
   */
  useEffect(() => {
    if (!resetLock && !currentDevice && onReset) onReset();
  }, [onReset, resetLock, currentDevice]);

  const { t } = useTranslation();

  const exec = useCallback(
    (appOp, targetId, app) =>
      command("appOpExec")({ appOp, targetId, app, devicePath: device.path }),
    [device],
  );

  return (
    <Box flow={4} selectable>
      <TrackPage
        category="Manager"
        name="Dashboard"
        deviceModelId={device.modelId}
        deviceVersion={deviceInfo.version}
      />
      <FirmwareUpdate
        t={t}
        device={device}
        deviceInfo={deviceInfo}
        onUpdateStart={lockReset}
        onUpdateStop={unlockReset}
      />
      {result ? (
        <AppsList device={device} deviceInfo={deviceInfo} result={result} exec={exec} />
      ) : null}
    </Box>
  );
};

export default Dashboard;
