// @flow
import { ipcRenderer } from "electron";
import debug from "debug";
import { CHECK_UPDATE_DELAY, DISABLE_ACTIVITY_INDICATORS } from "../config/constants";
import { killInternalProcess } from "./reset";
import { lock } from "./actions/application";
import { onSetDeviceBusy } from "~/renderer/components/DeviceBusyIndicator";
import { onSetLibcoreBusy } from "~/renderer/components/LibcoreBusyIndicator";
import { hasEncryptionKey } from "~/renderer/storage";

const d = {
  sync: debug("lwd:sync"),
  update: debug("lwd:update"),
};

export function sendEvent(channel: string, msgType: string, data: any) {
  ipcRenderer.send(channel, {
    type: msgType,
    data,
  });
}

export default ({ store }: { store: Object }) => {
  // Ensure all sub-processes are killed before creating new ones (dev mode...)
  killInternalProcess();

  ipcRenderer.on("lock", async () => {
    if (await hasEncryptionKey("app", "accounts")) {
      store.dispatch(lock());
    }
  });

  if (!DISABLE_ACTIVITY_INDICATORS) {
    ipcRenderer.on("setLibcoreBusy", (event: any, { busy }) => {
      onSetLibcoreBusy(busy);
    });

    ipcRenderer.on("setDeviceBusy", (event: any, { busy }) => {
      onSetDeviceBusy(busy);
    });
  }
};

export function checkUpdates() {
  d.update("Update - check");
  setTimeout(() => sendEvent("updater", "init"), CHECK_UPDATE_DELAY);
}
