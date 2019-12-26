/* eslint-disable flowtype/generic-spacing */
// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import type {
  AccountRaw,
  TransactionStatus,
  TransactionStatusRaw,
  TransactionRaw,
  SignAndBroadcastEventRaw,
  ScanAccountEventRaw,
} from "@ledgerhq/live-common/lib/types";
import {
  fromTransactionRaw,
  toTransactionRaw,
  toTransactionStatusRaw,
  toSignAndBroadcastEventRaw,
} from "@ledgerhq/live-common/lib/transaction";
import { fromAccountRaw, toAccountRaw } from "@ledgerhq/live-common/lib/account";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { toScanAccountEventRaw } from "@ledgerhq/live-common/lib/bridge";
import * as bridgeImpl from "@ledgerhq/live-common/lib/bridge/impl";

const cmdCurrencyScanAccountsOnDevice = (o: {
  currencyId: string,
  deviceId: string,
}): Observable<ScanAccountEventRaw> => {
  const currency = getCryptoCurrencyById(o.currencyId);
  const bridge = bridgeImpl.getCurrencyBridge(currency);
  return bridge.scanAccountsOnDevice(currency, o.deviceId).pipe(map(toScanAccountEventRaw));
};

const cmdAccountStartSync = (o: {
  account: AccountRaw,
  observation: boolean,
}): Observable<AccountRaw> => {
  const account = fromAccountRaw(o.account);
  const bridge = bridgeImpl.getAccountBridge(account, null);
  return bridge.startSync(account, o.observation).pipe(map(f => toAccountRaw(f(account))));
};

const cmdAccountPrepareTransaction = (o: {
  account: AccountRaw,
  transaction: TransactionRaw,
}): Observable<TransactionRaw> => {
  const account = fromAccountRaw(o.account);
  const transaction = fromTransactionRaw(o.transaction);
  const bridge = bridgeImpl.getAccountBridge(account, null);
  return from(bridge.prepareTransaction(account, transaction).then(toTransactionRaw));
};

const cmdAccountGetTransactionStatus = (o: {
  account: AccountRaw,
  transaction: TransactionRaw,
}): Observable<TransactionStatusRaw> => {
  const account = fromAccountRaw(o.account);
  const transaction = fromTransactionRaw(o.transaction);
  const bridge = bridgeImpl.getAccountBridge(account, null);
  return from(
    bridge
      .getTransactionStatus(account, transaction)
      .then((raw: TransactionStatus) => toTransactionStatusRaw(raw)),
  );
};

const cmdAccountSignAndBroadcast = (o: {
  account: AccountRaw,
  transaction: TransactionRaw,
  deviceId: string,
}): Observable<SignAndBroadcastEventRaw> => {
  const account = fromAccountRaw(o.account);
  const transaction = fromTransactionRaw(o.transaction);
  const bridge = bridgeImpl.getAccountBridge(account, null);
  return bridge
    .signAndBroadcast(account, transaction, o.deviceId)
    .pipe(map(toSignAndBroadcastEventRaw));
};

export const commands = {
  AccountStartSync: cmdAccountStartSync,
  AccountGetTransactionStatus: cmdAccountGetTransactionStatus,
  AccountPrepareTransaction: cmdAccountPrepareTransaction,
  AccountSignAndBroadcast: cmdAccountSignAndBroadcast,
  CurrencyScanAccountsOnDevice: cmdCurrencyScanAccountsOnDevice,
};
