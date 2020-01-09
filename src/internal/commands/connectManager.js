// @flow

import { concat, from, of, throwError } from "rxjs";
import type { Observable } from "rxjs";
import { concatMap, catchError } from "rxjs/operators";
import { TransportStatusError } from "@ledgerhq/errors";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";
import { listApps } from "@ledgerhq/live-common/lib/apps/hw";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import type { ListAppsEvent } from "@ledgerhq/live-common/lib/apps";

type Input = {
  devicePath: string,
};

export type ConnectManagerEvent =
  | { type: "appDetected" }
  | { type: "osu", deviceInfo: DeviceInfo }
  | { type: "bootloader", deviceInfo: DeviceInfo }
  | { type: "listingApps", deviceInfo: DeviceInfo }
  | ListAppsEvent;

const cmd = ({ devicePath }: Input): Observable<ConnectManagerEvent> =>
  withDevice(devicePath)(transport =>
    from(getDeviceInfo(transport)).pipe(
      concatMap(deviceInfo => {
        if (deviceInfo.isBootloader) {
          return of({ type: "bootloader", deviceInfo });
        }

        if (deviceInfo.isOSU) {
          return of({ type: "osu", deviceInfo });
        }

        return concat(of({ type: "listingApps", deviceInfo }), listApps(transport, deviceInfo));
      }),
      catchError((e: Error) => {
        if (
          e &&
          e instanceof TransportStatusError &&
          (e.statusCode === 0x6e00 || e.statusCode === 0x6d00)
        ) {
          return of({ type: "appDetected" });
        }
        return throwError(e);
      }),
    ),
  );

export default cmd;
