// @flow

import type { Observable } from "rxjs";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";
import { listApps } from "@ledgerhq/live-common/lib/apps/hw";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import { concatMap, distinctUntilChanged, scan, map } from "rxjs/operators";
import { from, of } from "rxjs";
import type { ListAppsResult } from "@ledgerhq/live-common/lib/apps";
import logger from "~/logger";
import manager from "@ledgerhq/live-common/lib/manager";

type Input = {
  devicePath: string,
};

export type ManagerConnectState = {
  deviceInfo?: DeviceInfo,
  allowManagerRequested: boolean,
  allowManagerGranted: boolean,
  listAppsRes?: ListAppsResult,
};

const seed: ManagerConnectState = {
  allowManagerRequested: false,
  allowManagerGranted: false,
};

const cmd = ({ devicePath }: Input): Observable<ManagerConnectState> =>
  withDevice(devicePath)(transport =>
    from(getDeviceInfo(transport)).pipe(
      concatMap(deviceInfo => {
        if (deviceInfo.isBootloader || deviceInfo.isOSU) {
          return of({ deviceInfo, event: {} }); // Maybe generic "not in dashboard state" event
        }

        // Preload things in parallel
        manager.getLatestFirmwareForDevice(deviceInfo).catch(e => {
          logger.warn(e);
        });

        return listApps(transport, deviceInfo).pipe(map(event => ({ event, deviceInfo })));
      }),
      scan((state: ManagerConnectState, e: *) => {
        const { deviceInfo, event } = e;
        const result = { ...state, deviceInfo };

        if (event.type === "device-permission-requested") {
          result.allowManagerRequested = true;
        } else if (event.type === "device-permission-granted") {
          result.allowManagerGranted = true;
        } else if (event.type === "result") {
          result.listAppsRes = event.result;
        }

        return result;
      }, seed),
      distinctUntilChanged(),
    ),
  );

export default cmd;
