// @flow

import MODAL_EXPORT_OPERATIONS from "./ExportOperations";
import MODAL_CONFIRM from "./ConfirmModal";
import MODAL_PASSWORD from "./PasswordModal";
import MODAL_DISABLE_PASSWORD from "./DisablePasswordModal";
import MODAL_ADD_ACCOUNTS from "./AddAccounts";
import MODAL_RECEIVE from "./Receive";
import MODAL_TERMS from "./Terms";
import MODAL_SEND from "./Send";
import MODAL_UPDATE_FIRMWARE from "./UpdateFirmwareModal";

const modals: { [_: string]: React$ComponentType<any> } = {
  MODAL_EXPORT_OPERATIONS,
  MODAL_CONFIRM,
  MODAL_PASSWORD,
  MODAL_DISABLE_PASSWORD,
  MODAL_ADD_ACCOUNTS,
  MODAL_RECEIVE,
  MODAL_TERMS,
  MODAL_SEND,
  MODAL_UPDATE_FIRMWARE,
};

export default modals;
