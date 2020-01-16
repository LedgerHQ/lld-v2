// @flow
import React, { PureComponent } from "react";
import { Trans, withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import type { CryptoCurrency, TokenCurrency, Account } from "@ledgerhq/live-common/lib/types";
import { addAccounts } from "@ledgerhq/live-common/lib/account";
import logger from "~/logger";
import type { Device } from "~/renderer/reducers/devices";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { replaceAccounts } from "~/renderer/actions/accounts";
import { closeModal } from "~/renderer/actions/modals";
import Track from "~/renderer/analytics/Track";
import type { Step } from "~/renderer/components/Stepper";
import SyncSkipUnderPriority from "~/renderer/components/SyncSkipUnderPriority";
import Modal from "~/renderer/components/Modal";
import Stepper from "~/renderer/components/Stepper";
import StepChooseCurrency, { StepChooseCurrencyFooter } from "./steps/StepChooseCurrency";
import StepConnectDevice, { StepConnectDeviceFooter } from "./steps/StepConnectDevice";
import StepImport, { StepImportFooter } from "./steps/StepImport";
import StepFinish, { StepFinishFooter } from "./steps/StepFinish";

type Props = {
  device: ?Device,
  existingAccounts: Account[],
  closeModal: string => void,
  replaceAccounts: (Account[]) => void,
};

type StepId = "chooseCurrency" | "connectDevice" | "import" | "finish";
type ScanStatus = "idle" | "scanning" | "error" | "finished";

export type StepProps = {
  t: TFunction,
  transitionTo: string => void,
  currency: ?CryptoCurrency | ?TokenCurrency,
  device: ?Device,
  isAppOpened: boolean,
  scannedAccounts: Account[],
  existingAccounts: Account[],
  checkedAccountsIds: string[],
  scanStatus: ScanStatus,
  err: ?Error,
  onClickAdd: () => Promise<void>,
  onGoStep1: () => void,
  onCloseModal: () => void,
  resetScanState: () => void,
  setCurrency: (?CryptoCurrency) => void,
  setAppOpened: boolean => void,
  setScanStatus: (ScanStatus, ?Error) => string,
  setAccountName: (Account, string) => void,
  editedNames: { [_: string]: string },
  setScannedAccounts: ({ scannedAccounts?: Account[], checkedAccountsIds?: string[] }) => void,
};

type St = Step<StepId, StepProps>;

const createSteps = (): St[] => {
  const onBack = ({ transitionTo, resetScanState }: StepProps) => {
    resetScanState();
    transitionTo("chooseCurrency");
  };
  return [
    {
      id: "chooseCurrency",
      label: <Trans i18nKey="addAccounts.breadcrumb.informations" />,
      component: StepChooseCurrency,
      footer: StepChooseCurrencyFooter,
      onBack: null,
      hideFooter: false,
      noScroll: true,
    },
    {
      id: "connectDevice",
      label: <Trans i18nKey="addAccounts.breadcrumb.connectDevice" />,
      component: StepConnectDevice,
      footer: StepConnectDeviceFooter,
      onBack,
      hideFooter: false,
    },
    {
      id: "import",
      label: <Trans i18nKey="addAccounts.breadcrumb.import" />,
      component: StepImport,
      footer: StepImportFooter,
      onBack,
      hideFooter: false,
    },
    {
      id: "finish",
      label: <Trans i18nKey="addAccounts.breadcrumb.finish" />,
      component: StepFinish,
      footer: StepFinishFooter,
      onBack: null,
      hideFooter: true,
    },
  ];
};

type State = {
  stepId: StepId,
  scanStatus: ScanStatus | string,

  isAppOpened: boolean,
  currency: ?CryptoCurrency,
  scannedAccounts: Account[],
  checkedAccountsIds: string[],
  editedNames: { [_: string]: string },
  err: ?Error,
  reset: number,
};

const mapStateToProps = createStructuredSelector({
  device: getCurrentDevice,
  existingAccounts: accountsSelector,
});

const mapDispatchToProps = {
  replaceAccounts,
  closeModal,
};

const INITIAL_STATE = {
  stepId: "chooseCurrency",
  isAppOpened: false,
  currency: null,
  scannedAccounts: [],
  checkedAccountsIds: [],
  editedNames: {},
  err: null,
  scanStatus: "idle",
  reset: 0,
};

class AddAccounts extends PureComponent<Props, State> {
  state = INITIAL_STATE;
  STEPS = createSteps();

  handleClickAdd = async () => {
    const { replaceAccounts, existingAccounts } = this.props;
    const { scannedAccounts, checkedAccountsIds, editedNames } = this.state;
    replaceAccounts(
      addAccounts({
        scannedAccounts,
        existingAccounts,
        selectedIds: checkedAccountsIds,
        renamings: editedNames,
      }),
    );
  };

  handleCloseModal = () => this.props.closeModal("MODAL_ADD_ACCOUNTS");
  handleStepChange = (step: St) => this.setState({ stepId: step.id });

  handleSetCurrency = (currency: ?CryptoCurrency) => this.setState({ currency });

  handleSetScanStatus = (scanStatus: string, err: ?Error = null) => {
    if (err) {
      logger.critical(err);
    }
    this.setState({ scanStatus, err });
  };

  handleSetAccountName = (account: Account, name: string) => {
    this.setState(({ editedNames }) => ({
      editedNames: { ...editedNames, [account.id]: name },
    }));
  };

  handleSetScannedAccounts = ({
    checkedAccountsIds,
    scannedAccounts,
  }: {
    checkedAccountsIds: string[],
    scannedAccounts: Account[],
  }) => {
    this.setState({
      // $FlowFixMe
      ...(checkedAccountsIds ? { checkedAccountsIds } : {}),
      ...(scannedAccounts ? { scannedAccounts } : {}),
    });
  };

  handleResetScanState = () => {
    this.setState({
      isAppOpened: false,
      scanStatus: "idle",
      err: null,
      scannedAccounts: [],
      checkedAccountsIds: [],
    });
  };

  handleSetAppOpened = (isAppOpened: boolean) => this.setState({ isAppOpened });

  handleBeforeOpen = ({ data }) => {
    const { currency } = this.state;

    if (!currency) {
      if (data && data.currency) {
        this.setState({
          currency: data.currency,
        });
      }
    }
  };

  onGoStep1 = () => {
    this.setState(({ reset }) => ({ ...INITIAL_STATE, reset: reset + 1 }));
  };

  render() {
    const { device, existingAccounts } = this.props;
    const {
      stepId,
      currency,
      isAppOpened,
      scannedAccounts,
      checkedAccountsIds,
      scanStatus,
      err,
      editedNames,
      reset,
    } = this.state;

    const stepperProps = {
      currency,
      device,
      existingAccounts,
      scannedAccounts,
      checkedAccountsIds,
      scanStatus,
      err,
      isAppOpened,
      onClickAdd: this.handleClickAdd,
      onCloseModal: this.handleCloseModal,
      setScanStatus: this.handleSetScanStatus,
      setCurrency: this.handleSetCurrency,
      setScannedAccounts: this.handleSetScannedAccounts,
      resetScanState: this.handleResetScanState,
      setAppOpened: this.handleSetAppOpened,
      setAccountName: this.handleSetAccountName,
      onGoStep1: this.onGoStep1,
      editedNames,
    };
    const title = <Trans i18nKey="addAccounts.title" />;

    const errorSteps = err ? [2] : [];

    return (
      <Modal
        centered
        name="MODAL_ADD_ACCOUNTS"
        refocusWhenChange={stepId}
        onHide={() => this.setState({ ...INITIAL_STATE })}
        onBeforeOpen={this.handleBeforeOpen}
        preventBackdropClick={stepId === "import"}
        render={({ onClose }) => (
          <Stepper
            key={reset} // THIS IS A HACK because stepper is not controllable. FIXME
            title={title}
            initialStepId="chooseCurrency"
            onStepChange={this.handleStepChange}
            onClose={onClose}
            steps={this.STEPS}
            errorSteps={errorSteps}
            {...stepperProps}
          >
            <Track onUnmount event="CloseModalAddAccounts" />
            <SyncSkipUnderPriority priority={100} />
          </Stepper>
        )}
      />
    );
  }
}

const m: React$ComponentType<{}> = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(AddAccounts);

export default m;
