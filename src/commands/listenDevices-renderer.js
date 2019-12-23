// @flow
import { never } from "rxjs";
import { createCommand } from "./ipc";

const cmd: any = createCommand("listenDevices", () => never());

export default cmd;
