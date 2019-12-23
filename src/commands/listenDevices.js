// @flow
import { Observable } from "rxjs";
import TransportNodeHidSingleton from "@ledgerhq/hw-transport-node-hid-singleton";
import { createCommand } from "./ipc";

const listenDevices = () => Observable.create(TransportNodeHidSingleton.listen);

const cmd: any = createCommand("listenDevices", listenDevices);

export default cmd;
