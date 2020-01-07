// @flow
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import type { ListAppsResult } from "@ledgerhq/live-common/lib/apps/types";
import type { Device } from "@ledgerhq/hw-transport/lib/Transport";
import AppList from "./AppsList";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import { command } from "~/renderer/commands";
import FirmwareUpdate from "./FirmwareUpdate";

type Props = {
  device: Device,
  deviceInfo: DeviceInfo,
  listAppsRes: ?ListAppsResult,
};

const Dashboard = ({ device, deviceInfo, listAppsRes }: Props) => {
  const { t } = useTranslation();
  const exec = useCallback(
    (appOp, targetId, app) =>
      command("appOpExec")({ appOp, targetId, app, devicePath: device.path }),
    [device],
  );

  return (
    <Box flow={4} pb={8} selectable>
      <TrackPage category="Manager" name="Dashboard" />
      <FirmwareUpdate t={t} device={device} deviceInfo={deviceInfo} />
      {listAppsRes ? (
        <AppList device={device} deviceInfo={deviceInfo} listAppsRes={listAppsRes} exec={exec} />
      ) : null}
    </Box>
  );
};

export default Dashboard;
