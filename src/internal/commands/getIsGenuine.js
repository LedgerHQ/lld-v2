// @flow

import type { Observable } from "rxjs";
import { of } from "rxjs";
import { delay } from "rxjs/operators";
import checkDeviceForManager from "@ledgerhq/live-common/lib/hw/checkDeviceForManager";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import type { DeviceInfo, GenuineCheckEvent } from "@ledgerhq/live-common/lib/types/manager";

// FIXME
const SKIP_GENUINE = !!process.env.SKIP_GENUINE;

type Input = {
  devicePath: string,
  deviceInfo: DeviceInfo,
};
type Result = GenuineCheckEvent;

const cmd = ({ devicePath, deviceInfo }: Input): Observable<Result> =>
  withDevice(devicePath)(transport =>
    SKIP_GENUINE
      ? of({ type: "result", payload: "0000" }).pipe(delay(1000))
      : checkDeviceForManager(transport, deviceInfo),
  );

export default cmd;
