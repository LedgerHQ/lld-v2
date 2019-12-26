/* eslint-disable flowtype/generic-spacing */
// @flow

import { map } from "rxjs/operators";
import type {
  CryptoCurrency,
  Account,
  AccountLike,
  CurrencyBridge,
  AccountBridge,
} from "@ledgerhq/live-common/lib/types";
import isEqual from "lodash/isEqual";
import {
  fromTransactionRaw,
  toTransactionRaw,
  fromTransactionStatusRaw,
  fromSignAndBroadcastEventRaw,
} from "@ledgerhq/live-common/lib/transaction";
import { toAccountRaw } from "@ledgerhq/live-common/lib/account";
import { patchAccount } from "@ledgerhq/live-common/lib/reconciliation";
import { fromScanAccountEventRaw } from "@ledgerhq/live-common/lib/bridge";
import * as bridgeImpl from "@ledgerhq/live-common/lib/bridge/impl";
import { command } from "~/renderer/commands";

const scanAccountsOnDevice = (currency, deviceId) =>
  command("CurrencyScanAccountsOnDevice")({
    currencyId: currency.id,
    deviceId,
  }).pipe(map(fromScanAccountEventRaw));

export const getCurrencyBridge = (currency: CryptoCurrency): CurrencyBridge => ({
  preload: () => bridgeImpl.getCurrencyBridge(currency).preload(),

  hydrate: value => bridgeImpl.getCurrencyBridge(currency).hydrate(value),

  scanAccountsOnDevice,
});

export const getAccountBridge = (
  account: AccountLike,
  parentAccount: ?Account,
): AccountBridge<any> => {
  const startSync = (account, observation) =>
    command("AccountStartSync")({
      account: toAccountRaw(account),
      observation,
    }).pipe(map(raw => account => patchAccount(account, raw)));

  const createTransaction = a =>
    bridgeImpl.getAccountBridge(account, parentAccount).createTransaction(a);

  const updateTransaction = (a, patch) =>
    bridgeImpl.getAccountBridge(account, parentAccount).updateTransaction(a, patch);

  const prepareTransaction = async (a, t) => {
    const transaction = toTransactionRaw(t);
    const result = await command("AccountPrepareTransaction")({
      account: toAccountRaw(a),
      transaction,
    }).toPromise();

    // this will remove the `undefined` fields due to JSON back&forth
    const sentTransaction = JSON.parse(JSON.stringify(transaction));
    if (isEqual(sentTransaction, result)) {
      return t; // preserve reference by deep equality of the TransactionRaw
    }
    return fromTransactionRaw(result);
  };

  const getTransactionStatus = (a, t) =>
    command("AccountGetTransactionStatus")({
      account: toAccountRaw(a),
      transaction: toTransactionRaw(t),
    })
      .toPromise()
      .then(fromTransactionStatusRaw);

  const signAndBroadcast = (a, t, deviceId) =>
    command("AccountSignAndBroadcast")({
      account: toAccountRaw(a),
      transaction: toTransactionRaw(t),
      deviceId,
    }).pipe(map(raw => fromSignAndBroadcastEventRaw(raw, a.id)));

  return {
    createTransaction,
    updateTransaction,
    getTransactionStatus,
    prepareTransaction,
    startSync,
    signAndBroadcast,
  };
};
