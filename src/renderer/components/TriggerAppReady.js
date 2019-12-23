// @flow

import { useEffect } from "react";
import { ipcRenderer } from "electron";

const TriggerAppReady = () => {
  useEffect(() => {
    ipcRenderer.send("ready-to-show", {});
  }, []);

  return null;
};

export default TriggerAppReady;
