// @flow
import { ReplaySubject, concat, of, empty, interval } from "rxjs";
import { scan, debounce, catchError, switchMap } from "rxjs/operators";
import { useEffect, useCallback, useState } from "react";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import type { ListAppsResult } from "@ledgerhq/live-common/lib/apps/types";
import manager from "@ledgerhq/live-common/lib/manager";
import type { ConnectManagerEvent } from "~/internal/commands/connectManager";
import type { Device } from "~/renderer/reducers/devices";
import { command } from "~/renderer/commands";
import logger from "~/logger";

export type ManagerConnectState = {|
  inApp: boolean,
  allowManagerRequestedWording: ?string,
  allowManagerGranted: boolean,
  isLoading: boolean,
  device: ?Device,
  deviceInfo: ?DeviceInfo,
  result: ?ListAppsResult,
  error: ?Error,
|};

type Action =
  | ConnectManagerEvent
  | { type: "error", error: Error }
  | { type: "deviceChange", device: ?Device };

const initialState: ManagerConnectState = {
  isLoading: true,
  inApp: false,
  allowManagerRequestedWording: null,
  allowManagerGranted: false,
  device: null,
  deviceInfo: null,
  result: null,
  error: null,
};

const reducer = (state: ManagerConnectState, action: Action): ManagerConnectState => {
  switch (action.type) {
    case "deviceChange":
      return { ...initialState, device: action.device, isLoading: !!action.device };

    case "error":
      return { ...initialState, error: action.error, isLoading: false };

    case "appDetected":
      return {
        ...state,
        inApp: true,
      };

    case "osu":
    case "bootloader":
      return {
        ...state,
        inApp: false,
        deviceInfo: action.deviceInfo,
        isLoading: false,
      };

    case "listingApps":
      return {
        ...state,
        inApp: false,
        deviceInfo: action.deviceInfo,
      };

    case "device-permission-requested":
      return { ...state, allowManagerRequestedWording: action.wording };

    case "device-permission-granted":
      return { ...state, allowManagerRequestedWording: null, allowManagerGranted: true };

    case "result":
      return { ...state, result: action.result, isLoading: false };
  }
  return state;
};

// emit value each time it changes by reference. it replays the last value at subscribe time.
function useReplaySubject<T>(value: T): ReplaySubject<T> {
  const [subject] = useState(() => new ReplaySubject());
  useEffect(() => {
    subject.next(value);
  }, [value]);
  useEffect(() => {
    return () => {
      subject.complete();
    };
  }, []);
  return subject;
}

const connectManager = device =>
  concat(
    of({ type: "deviceChange", device }),
    !device
      ? empty()
      : command("connectManager")({ devicePath: device.path }).pipe(
          catchError((error: Error) => of({ type: "error", error })),
        ),
  );

export const useManagerConnect = (
  device: ?Device,
): ([ManagerConnectState, { onRetry: () => void }]) => {
  const [state, setState] = useState(initialState);
  const [resetIndex, setResetIndex] = useState(0);
  const deviceSubject = useReplaySubject(device);

  useEffect(() => {
    const sub = deviceSubject
      .pipe(
        // each time there is a device change, we pipe to the command
        switchMap(connectManager),
        // tap(e => console.log("connectManager event", e)),
        // we gather all events with a reducer into the UI state
        scan(reducer, initialState),
        // tap(s => console.log("connectManager state", s)),
        // we debounce the UI state to not blink on the UI
        debounce(s => {
          if (s.allowManagerRequestedWording || s.allowManagerGranted) {
            // no debounce for allow manager
            return empty();
          }
          // default debounce (to be tweak)
          return interval(1500);
        }),
      )
      // the state simply goes into a React state
      .subscribe(setState);

    return () => sub.unsubscribe();
  }, [deviceSubject, resetIndex]);

  const { deviceInfo } = state;
  useEffect(() => {
    if (!deviceInfo) return;
    // Preload latest firmware in parallel
    manager.getLatestFirmwareForDevice(deviceInfo).catch((e: Error) => {
      logger.warn(e);
    });
  }, [deviceInfo]);

  const onRetry = useCallback(() => {
    setResetIndex(resetIndex + 1);
  }, [resetIndex]);

  return [state, { onRetry }];
};
