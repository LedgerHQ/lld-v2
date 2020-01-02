// @flow
import React, { useCallback } from "react";
import { connect } from "react-redux";
import { useDelegation } from "@ledgerhq/live-common/lib/families/tezos/bakers";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { openModal } from "~/renderer/actions/modals";
import {
  SendActionDefault,
  ReceiveActionDefault,
} from "~/renderer/screens/account/AccountActionsDefault";

type OwnProps = {
  account: AccountLike,
  parentAccount: ?Account,
  onClick: () => void,
};

type Props = OwnProps & {
  openModal: (modal: string, opts?: *) => void,
};

const SendActionC = ({ account, parentAccount, onClick, openModal }: Props) => {
  const delegation = useDelegation(account);
  const sendShouldWarnDelegation = delegation && delegation.sendShouldWarnDelegation;

  const onClickDecorated = useCallback(() => {
    if (sendShouldWarnDelegation) {
      openModal("MODAL_SEND", {
        parentAccount,
        account,
        startWithWarning: sendShouldWarnDelegation,
      });
    } else {
      onClick();
    }
  }, [sendShouldWarnDelegation, parentAccount, account, openModal, onClick]);

  return (
    <SendActionDefault onClick={onClickDecorated} account={account} parentAccount={parentAccount} />
  );
};

const ReceiveActionC = ({ account, parentAccount, onClick, openModal }: Props) => {
  const delegation = useDelegation(account);
  const receiveShouldWarnDelegation = delegation && delegation.receiveShouldWarnDelegation;

  const onClickDecorated = useCallback(() => {
    if (receiveShouldWarnDelegation) {
      openModal("MODAL_RECEIVE", {
        parentAccount,
        account,
        startWithWarning: receiveShouldWarnDelegation,
      });
    } else {
      onClick();
    }
  }, [receiveShouldWarnDelegation, parentAccount, account, openModal, onClick]);

  return (
    <ReceiveActionDefault
      onClick={onClickDecorated}
      account={account}
      parentAccount={parentAccount}
    />
  );
};

const SendAction: React$ComponentType<OwnProps> = connect(null, { openModal })(SendActionC);
const ReceiveAction: React$ComponentType<OwnProps> = connect(null, { openModal })(ReceiveActionC);

export default { SendAction, ReceiveAction };
