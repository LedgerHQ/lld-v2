// @flow
import { ReplaySubject, concat, of, empty, interval } from "rxjs";
import { scan, debounce, debounceTime, catchError, switchMap } from "rxjs/operators";
import { useEffect, useCallback, useState } from "react";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import type { ListAppsResult } from "@ledgerhq/live-common/lib/apps/types";
import manager from "@ledgerhq/live-common/lib/manager";
import type { ConnectManagerEvent } from "~/internal/commands/connectManager";
import type { Device } from "~/renderer/reducers/devices";
import { command } from "~/renderer/commands";
import logger from "~/logger";

export type State = {|
  isLoading: boolean,
  inApp: boolean,
  unresponsive: boolean,
  allowManagerRequestedWording: ?string,
  allowManagerGranted: boolean,
  device: ?Device,
  deviceInfo: ?DeviceInfo,
  result: ?ListAppsResult,
  error: ?Error,
  repairModalOpened: ?{ auto: boolean },
|};

export type Cbs = {|
  onRetry: () => void,
  onAutoRepair: () => void,
  onRepairModal: boolean => void,
  closeRepairModal: () => void,
|};

type Action =
  | ConnectManagerEvent
  | { type: "error", error: Error }
  | { type: "deviceChange", device: ?Device };

const getInitialState = (device?: ?Device): State => ({
  isLoading: !!device,
  inApp: false,
  unresponsive: false,
  allowManagerRequestedWording: null,
  allowManagerGranted: false,
  device: null,
  deviceInfo: null,
  result: null,
  error: null,
  repairModalOpened: null,
});

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "unresponsiveDevice":
      return {
        ...state,
        unresponsive: true,
      };

    case "deviceChange":
      return {
        ...getInitialState(action.device),
        device: action.device,
      };

    case "error":
      return {
        ...getInitialState(),
        error: action.error,
        isLoading: false,
      };

    case "appDetected":
      return {
        ...state,
        unresponsive: false,
        inApp: true,
      };

    case "osu":
    case "bootloader":
      return {
        ...state,
        isLoading: false,
        unresponsive: false,
        inApp: false,
        deviceInfo: action.deviceInfo,
      };

    case "listingApps":
      return {
        ...state,
        inApp: false,
        unresponsive: false,
        deviceInfo: action.deviceInfo,
      };

    case "device-permission-requested":
      return {
        ...state,
        unresponsive: false,
        allowManagerRequestedWording: action.wording,
      };

    case "device-permission-granted":
      return {
        ...state,
        unresponsive: false,
        allowManagerRequestedWording: null,
        allowManagerGranted: true,
      };

    case "result":
      return {
        ...state,
        isLoading: false,
        unresponsive: false,
        result: action.result,
      };
  }
  return state;
};

// emit value each time it changes by reference. it replays the last value at subscribe time.
function useReplaySubject<T>(value: T): ReplaySubject<T> {
  const [subject] = useState(() => new ReplaySubject());
  useEffect(() => {
    subject.next(value);
  }, [subject, value]);
  useEffect(() => {
    return () => {
      subject.complete();
    };
  }, [subject]);
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

export const useManagerConnect = (device: ?Device): [State, Cbs] => {
  // repair modal will interrupt everything and be rendered instead of the background content
  const [repairModalOpened, setRepairModalOpened] = useState(null);
  const [state, setState] = useState(() => getInitialState(device));
  const [resetIndex, setResetIndex] = useState(0);
  const deviceSubject = useReplaySubject(device);

  useEffect(() => {
    if (repairModalOpened) return;

    const sub = deviceSubject
      .pipe(
        // debounce a bit the connect/disconnect event that we don't need
        debounceTime(1000),
        // each time there is a device change, we pipe to the command
        switchMap(connectManager),
        // tap(e => console.log("connectManager event", e)),
        // we gather all events with a reducer into the UI state
        scan(reducer, getInitialState()),
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

    return () => {
      sub.unsubscribe();
    };
  }, [deviceSubject, resetIndex, repairModalOpened]);

  const { deviceInfo } = state;
  useEffect(() => {
    if (!deviceInfo) return;
    // Preload latest firmware in parallel
    manager.getLatestFirmwareForDevice(deviceInfo).catch((e: Error) => {
      logger.warn(e);
    });
  }, [deviceInfo]);

  const onRepairModal = useCallback(open => {
    setRepairModalOpened(open ? { auto: false } : null);
  }, []);

  const closeRepairModal = useCallback(() => {
    setRepairModalOpened(null);
  }, []);

  const onRetry = useCallback(() => {
    setResetIndex(currIndex => currIndex + 1);
  }, []);

  const onAutoRepair = useCallback(() => {
    setRepairModalOpened({ auto: true });
  }, []);

  return [
    { ...state, repairModalOpened },
    { onRetry, onAutoRepair, closeRepairModal, onRepairModal },
  ];
};
