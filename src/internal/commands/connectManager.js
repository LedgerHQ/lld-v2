// @flow

import type { Observable } from "rxjs";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";
import { listApps } from "@ledgerhq/live-common/lib/apps/hw";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import { concatMap, scan } from "rxjs/operators";
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
          return of({ ...seed, deviceInfo });
        }

        // Preload things in parallel
        manager.getLatestFirmwareForDevice(deviceInfo).catch(e => {
          logger.warn(e);
        });

        return listApps(transport, deviceInfo).pipe(
          scan((state: ManagerConnectState, e: *) => {
            const response = { ...state, deviceInfo };

            if (e.type === "device-permission-requested") {
              response.allowManagerRequested = true;
            } else if (e.type === "device-permission-granted") {
              response.allowManagerGranted = true;
            } else if (e.type === "result") {
              response.listAppsRes = e.result;
            }

            return response;
          }, seed),
        );
      }),
    ),
  );

export default cmd;
