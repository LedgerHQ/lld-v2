// @flow

import { app } from "electron";
import path from "path";
import Store from "./Store";
import fs from "fs";
import { readFile } from "~/main/db/fsHelper";
import omit from "lodash/omit";
import { decryptData } from "~/main/db/crypto";

const userData = app.getPath("userData");
const legacyConfigPath = path.resolve(userData, "app.json");

const migrateLegacyConfig = async stores => {
  const legacyRawConfig = await readFile(legacyConfigPath);
  const legacyConfig = JSON.parse(legacyRawConfig);

  const { config, cache, accounts } = stores;

  config.set(omit(legacyConfig.data, "accounts"));
  cache.set({
    countervalues: legacyConfig.countervalues,
  });

  // we check if the legacy account data is crypted or not
  if (typeof accounts === "object") {
    accounts.set(legacyConfig.data.accounts);
  } else {
    accounts.fileData = legacyConfig.data.accounts;
  }

  accounts.updateEncryptionKey("lolilol");

  await Promise.all([config.saveToDisk(), cache.saveToDisk(), accounts.saveToDisk()]);
};

class StorageService {
  constructor() {
    this.stores = {
      config: new Store({
        name: "config",
        fileExtension: "json",
      }),
      accounts: new Store({
        name: "accounts",
        fileExtension: "json",
      }),
      cache: new Store({
        name: "cache",
        fileExtension: "json",
      }),
    };

    this.isLocked = false;
    this.password = null;
  }

  async start() {
    // we migrate the user config if it is legacy
    if (fs.existsSync(legacyConfigPath)) {
      await migrateLegacyConfig(this.stores);
    } else {
      await Promise.all([
        this.stores.config.loadOrCreate(),
        this.stores.cache.loadOrCreate(),
        this.stores.accounts.loadOrCreate(),
      ]);
    }
    const config = this.stores.config.get();

    if (config.hasPassword) {
      this.isLocked = true;
    }
  }

  lock() {
    if (!this.isLocked) {
      this.stores.accounts.setEncryptionKey(null);
      this.isLocked = true;
      return true;
    }
    return false;
  }

  unlock(password: string) {
    if (this.isLocked && this.verifyPassword(password)) {
      this.isLocked = false;
      this.stores.accounts.setEncryptionKey(password);
      return true;
    }
    return false;
  }

  verifyPassword(password: string) {
    try {
      decryptData(this.stores.accounts.fileData, password)
      return true;
    } catch {
      return false;
    }
  }

  get(store) {
    return this.stores[store].get();
  }

  set(store, data) {
    return this.stores[store].set(data);
  }

  setPassword(password: string) {
    this.password = password;
  }

  changePassword(oldPassword: string, newPassword: string) {
    if (this.password === oldPassword) {
      this.stores.accounts.updateEncryptionKey(newPassword);
      this.password = newPassword;
    }
  }
}

export default StorageService;
