// @flow

import type { Observable } from "rxjs";
import getAppAndVersion from "@ledgerhq/live-common/lib/hw/getAppAndVersion";
import { from } from "rxjs";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";

type Input = {
  devicePath: string,
};

type Result = {
  name: string,
  version: string,
};

const cmd = ({ devicePath }: Input): Observable<Result> =>
  withDevice(devicePath)(transport =>
    from(getAppAndVersion(transport).then(({ name, version }) => ({ name, version }))),
  );

export default cmd;
