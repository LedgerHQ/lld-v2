// @flow
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import type { ListAppsResult } from "@ledgerhq/live-common/lib/apps/types";
import type { Device } from "~/renderer/reducers/devices";
import AppsList from "./AppsList";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import { command } from "~/renderer/commands";
import FirmwareUpdate from "./FirmwareUpdate";

type Props = {
  device: Device,
  deviceInfo: DeviceInfo,
  result: ?ListAppsResult,
};

const Dashboard = ({ device, deviceInfo, result }: Props) => {
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
      <FirmwareUpdate t={t} device={device} deviceInfo={deviceInfo} />
      {result ? (
        <AppsList device={device} deviceInfo={deviceInfo} result={result} exec={exec} />
      ) : null}
    </Box>
  );
};

export default Dashboard;
