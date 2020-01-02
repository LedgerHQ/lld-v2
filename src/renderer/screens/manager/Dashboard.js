// @flow
import React, { useCallback } from "react";
import { withTranslation } from "react-i18next";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import type { ListAppsResult } from "@ledgerhq/live-common/lib/apps/types";

import AppList from "./AppsList";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import { command } from "~/renderer/commands";
import type { Device } from "@ledgerhq/hw-transport/lib/Transport";

type Props = {
  device: Device,
  deviceInfo: DeviceInfo,
  listAppsRes: ?ListAppsResult,
};

const Dashboard = ({ device, deviceInfo, listAppsRes }: Props) => {
  const exec = useCallback(
    (appOp, targetId, app) =>
      command("appOpExec")({ appOp, targetId, app, devicePath: device.path }),
    [device],
  );

  return (
    <Box flow={4} pb={8} selectable>
      <TrackPage category="Manager" name="Dashboard" />
      {listAppsRes ? (
        <AppList device={device} deviceInfo={deviceInfo} listAppsRes={listAppsRes} exec={exec} />
      ) : null}
    </Box>
  );
};

export default withTranslation()(Dashboard);
