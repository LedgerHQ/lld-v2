// @flow

import type { Observable } from "rxjs";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";
import { listApps } from "@ledgerhq/live-common/lib/apps/hw";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import { concatMap, scan, startWith } from "rxjs/operators";
import { from, of } from "rxjs";
import type { ListAppsResult } from "@ledgerhq/live-common/lib/apps";
import logger from "~/logger";
import manager from "@ledgerhq/live-common/lib/manager";
import getAppAndVersion from "@ledgerhq/live-common/lib/hw/getAppAndVersion";

type Input = {
  devicePath: string,
};

export type ManagerConnectState = {
  allowManagerGranted: boolean,
  allowManagerRequested: boolean,
  deviceInDashboard: boolean,
  deviceInfo?: DeviceInfo,
  isLoading: boolean,
  listAppsRes?: ListAppsResult,
};

const seed: ManagerConnectState = {
  allowManagerGranted: false,
  allowManagerRequested: false,
  deviceInDashboard: true,
  isLoading: false,
};

const cmd = ({ devicePath }: Input): Observable<ManagerConnectState> =>
  withDevice(devicePath)(transport =>
    from(getAppAndVersion(transport)).pipe(
      concatMap(appAndVersion => {
        if (!["BOLOS", "OLOS\u0000"].includes(appAndVersion.name)) {
          // Not in dashboard
          return of({ ...seed, deviceInDashboard: false });
        }

        return from(getDeviceInfo(transport)).pipe(
          concatMap(deviceInfo => {
            if (deviceInfo.isBootloader || deviceInfo.isOSU) {
              return of({ ...seed, deviceInfo });
            }

            // Preload things in parallel
            manager.getLatestFirmwareForDevice(deviceInfo).catch(e => {
              logger.warn(e);
            });

            return listApps(transport, deviceInfo).pipe(
              startWith({ type: "loading" }),
              scan((state: ManagerConnectState, e: *) => {
                const response = { ...state, isLoading: true, deviceInfo };

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
        );
      }),
    ),
  );

export default cmd;
