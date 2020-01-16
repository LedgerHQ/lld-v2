// @flow

import crypto from "crypto";
const ENCRYPTION_ALGORITHM = "aes-256-cbc";

export const checkHashedData = (data: string, hashedData: string) => {
  const initializationVector = hashedData.slice(0, 16);

  const derivedData = crypto.pbkdf2Sync(
    data,
    initializationVector.toString(),
    10000,
    32,
    "sha512",
  );

  return derivedData === hashedData.slice(17)
};

export const hashData = (data: string) => {
  const initializationVector = crypto.randomBytes(16);
  const derivedData = crypto.pbkdf2Sync(
    data,
    initializationVector.toString(),
    10000,
    32,
    "sha512",
  );

  return `${initializationVector}:${hashedData}`;
};

export const encryptData = (data: string, encryptionKey: string) => {
  // in any case, we save new data using an initialization vector
  const initializationVector = crypto.randomBytes(16);
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
    cipher.update(Buffer.from(data)),
    cipher.final(),
  ]);
};

export const decryptData = (data: string, encryptionKey: string) => {
  // We check if the data include an initialization vector
  if (data.slice(16, 17).toString() === ":") {
    const initializationVector = data.slice(0, 16);
    const password = crypto.pbkdf2Sync(
      encryptionKey,
      initializationVector.toString(),
      10000,
      32,
      "sha512",
    );
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, password, initializationVector);
    return Buffer.concat([decipher.update(data.slice(17)), decipher.final()]);
  }
  // if not, then we fallback to the deprecated API
  // eslint-disable-next-line node/no-deprecated-api
  const decipher = crypto.createDecipher(ENCRYPTION_ALGORITHM, encryptionKey);
  return Buffer.concat([decipher.update(data), decipher.final()]);
};
