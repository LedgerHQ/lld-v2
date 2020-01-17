// @flow

import { ipcRenderer } from "electron";
import accountModel from "~/helpers/accountModel";

/*
  This file serve as an interface for the RPC binding to the main thread that now manage the config file.
  Because only serialized json can be sent between processes, the transform system now live here.
 */

const transforms = {};

transforms.accounts = {
  get: (raws: *) => (raws || []).map(accountModel.decode),
  set: (accounts: *) => (accounts || []).map(accountModel.encode),
};

export const getKey = async (ns: string, keyPath: string, defaultValue: any) => {
  let data = await ipcRenderer.invoke("getKey", { ns, keyPath, defaultValue });

  const transform = transforms[keyPath];
  if (transform) {
    data = transform.get(data);
  }

  return data;
};

export const setKey = (ns: string, keyPath: string, value: any) => {
  let data = value;

  const transform = transforms[keyPath];
  if (transform) {
    data = transform.set(data);
  }

  return ipcRenderer.invoke("setKey", { ns, keyPath, value: data });
};

export const hasEncryptionKey = (ns: string, keyPath: string) =>
  ipcRenderer.invoke("hasEncryptionKey", { ns, keyPath });

export const setEncryptionKey = (ns: string, keyPath: string, encryptionKey: string) =>
  ipcRenderer.invoke("setEncryptionKey", { ns, keyPath, encryptionKey });

export const removeEncryptionKey = (ns: string, keyPath: string) =>
  ipcRenderer.invoke("removeEncryptionKey", { ns, keyPath });

export const isEncryptionKeyCorrect = (ns: string, keyPath: string, encryptionKey: string) =>
  ipcRenderer.invoke("isEncryptionKeyCorrect", { ns, keyPath, encryptionKey });

export const hasBeenDecrypted = (ns: string, keyPath: string) =>
  ipcRenderer.invoke("hasBeenDecrypted", { ns, keyPath });

export const resetAll = () => ipcRenderer.invoke("resetAll");

export const cleanCache = () => ipcRenderer.invoke("cleanCache");
