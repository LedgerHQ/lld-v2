// @flow

import { app } from "electron";
import path from "path";
import { readFile, writeFile } from "~/main/db/fsHelper";
import { encryptData, decryptData } from "~/main/db/crypto";
import fs from "fs";
import defaults from "./defaults";

const userData = app.getPath("userData");

type StoreConfig = {
  name: string,
  fileExtension?: string,
  encryptionKey?: string,
};

class Store {
  constructor({ name, fileExtension, encryptionKey }: StoreConfig) {
    this.name = name;
    this.filePath = path.resolve(userData, fileExtension ? `${name}.${fileExtension}` : name);
    this.encryptionKey = encryptionKey;
  }

  updateEncryptionKey(encryptionKey: string) {
    if (this.fileData) {
      if (this.encryptionKey) {
        const decryptedFileData = decryptData(this.fileData, this.encryptionKey);
        this.fileData = encryptData(decryptedFileData, encryptionKey);
      } else {
        this.fileData = encryptData(this.fileData, encryptionKey);
      }
    }
    this.encryptionKey = encryptionKey;
  }

  setEncryptionKey(encryptionKey: string) {
    this.encryptionKey = encryptionKey;
  }

  async loadOrCreate() {
    if (fs.existsSync(this.filePath)) {
      await this.loadFromDisk();
    } else {
      this.set(defaults[this.name] || {});
      await this.saveToDisk();
    }
  }

  async loadFromDisk() {
    this.fileData = readFile(this.filePath);
  }

  async saveToDisk() {
    await writeFile(this.filePath, this.fileData);
  }

  get() {
    const rawData = this.encryptionKey
      ? decryptData(this.fileData, this.encryptionKey)
      : this.fileData;

    return JSON.parse(rawData);
  }

  set(dataObject: {}) {
    const rawData = JSON.stringify(dataObject);

    this.fileData = this.encryptionKey ? encryptData(rawData, this.encryptionKey) : rawData;
  }
}

export default Store;
