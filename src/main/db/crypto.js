// @flow

import crypto from "crypto";
const ENCRYPTION_ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

export const encryptData = (data: string, encryptionKey: string) => {
  // in any case, we save new data using an initialization vector
  const initializationVector = crypto.randomBytes(IV_LENGTH);
  const password = crypto.pbkdf2Sync(
    encryptionKey,
    initializationVector.toString(),
    10000,
    32,
    "sha512",
  );
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, password, initializationVector);
  return Buffer.concat([
    initializationVector,
    Buffer.from(":"),
    cipher.update(data, "utf8"),
    cipher.final(),
  ]).toString("base64");
};

export const decryptData = (raw: string, encryptionKey: string) => {
  const data = Buffer.from(raw, "base64");

  // We check if the data include an initialization vector
  if (data.slice(IV_LENGTH, IV_LENGTH + 1).toString() === ":") {
    const initializationVector = data.slice(0, IV_LENGTH);
    const password = crypto.pbkdf2Sync(
      encryptionKey,
      initializationVector.toString(),
      10000,
      32,
      "sha512",
    );
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, password, initializationVector);
    return Buffer.concat([decipher.update(data.slice(IV_LENGTH + 1)), decipher.final()]).toString(
      "utf8",
    );
  }
  // if not, then we fallback to the deprecated API
  // eslint-disable-next-line node/no-deprecated-api
  const decipher = crypto.createDecipher(ENCRYPTION_ALGORITHM, encryptionKey);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
};
