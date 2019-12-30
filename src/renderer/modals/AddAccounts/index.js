// @flow
import React, { useMemo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { CryptoCurrency, TokenCurrency, Account } from "@ledgerhq/live-common/lib/types";
import { addAccounts } from "@ledgerhq/live-common/lib/account";
import logger from "~/logger";
import type { Device } from "~/renderer/reducers/devices";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { accountsSelector } from "~/renderer/reducers/accounts";
import type { State } from "~/renderer/reducers";
import { replaceAccounts } from "~/renderer/actions/accounts";
import { closeModal } from "~/renderer/actions/modals";
import Track from "~/renderer/analytics/Track";
import type { StepProps as DefaultStepProps, Step } from "~/renderer/components/Stepper";
import SyncSkipUnderPriority from "~/renderer/components/SyncSkipUnderPriority";
import Modal from "~/renderer/components/Modal";
import Stepper from "~/renderer/components/Stepper";
import StepChooseCurrency, { StepChooseCurrencyFooter } from "./steps/StepChooseCurrency";
import StepConnectDevice, { StepConnectDeviceFooter } from "./steps/StepConnectDevice";
import StepImport, { StepImportFooter } from "./steps/StepImport";
import StepFinish, { StepFinishFooter } from "./steps/StepFinish";

type StepId = "chooseCurrency" | "connectDevice" | "import" | "finish";
type ScanStatus = "idle" | "scanning" | "error" | "finished";
type MaybeCryptoCurrency = ?CryptoCurrency;
type MaybeError = ?Error;

export type StepProps = DefaultStepProps & {
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
  // FIXME: Conflicts with <Select /> expecting a ?Currency
  setCurrency: (?CryptoCurrency) => void,
  setAppOpened: boolean => void,
  setScanStatus: (ScanStatus, ?Error) => string,
  setAccountName: (Account, string) => void,
  editedNames: { [_: string]: string },
  setScannedAccounts: ({ scannedAccounts?: Account[], checkedAccountsIds?: string[] }) => void,
};

const AddAccounts = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const device = useSelector<State, ?Device>(getCurrentDevice);
  const existingAccounts = useSelector(accountsSelector);
  const [stepId, setStepId] = useState<StepId | string>("chooseCurrency");
  const [isAppOpened, setIsAppOpened] = useState(false);
  const [currency, setCurrency] = useState<MaybeCryptoCurrency>(null);
  const [scannedAccounts, setScannedAccounts] = useState<Account[]>([]);
  const [checkedAccountsIds, setCheckedAccountsIds] = useState<string[]>([]);
  const [editedNames, setEditedNames] = useState<{ [_: string]: string }>({});
  const [err, setErr] = useState<MaybeError>(null);
  const [scanStatus, setScanStatus] = useState<ScanStatus | string>("idle");
  const [reset, setReset] = useState(0);

  const onBack = useCallback(({ transitionTo, resetScanState }: StepProps) => {
    resetScanState();
    transitionTo("chooseCurrency");
  }, []);

  const steps = useMemo(() => {
    return [
      {
        id: "chooseCurrency",
        label: t("addAccounts.breadcrumb.informations"),
        component: StepChooseCurrency,
        footer: StepChooseCurrencyFooter,
        onBack: null,
        hideFooter: false,
        noScroll: true,
      },
      {
        id: "connectDevice",
        label: t("addAccounts.breadcrumb.connectDevice"),
        component: StepConnectDevice,
        footer: StepConnectDeviceFooter,
        onBack,
        hideFooter: false,
      },
      {
        id: "import",
        label: t("addAccounts.breadcrumb.import"),
        component: StepImport,
        footer: StepImportFooter,
        onBack,
        hideFooter: false,
      },
      {
        id: "finish",
        label: t("addAccounts.breadcrumb.finish"),
        component: StepFinish,
        footer: StepFinishFooter,
        onBack: null,
        hideFooter: true,
      },
    ];
  }, [onBack, t]);

  const handleClickAdd = useCallback(async () => {
    dispatch(
      replaceAccounts(
        addAccounts({
          scannedAccounts,
          existingAccounts,
          selectedIds: checkedAccountsIds,
          renamings: editedNames,
        }),
      ),
    );
  }, [dispatch, existingAccounts, scannedAccounts, checkedAccountsIds, editedNames]);

  const handleCloseModal = useCallback(() => dispatch(closeModal("MODAL_ADD_ACCOUNTS")), [
    dispatch,
  ]);

  const handleStepChange = useCallback((step: Step) => setStepId(step.id), [setStepId]);

  const handleSetCurrency = useCallback(
    (currency: ?CryptoCurrency) => {
      setCurrency(currency);
    },
    [setCurrency],
  );

  const handleSetScanStatus = useCallback(
    (scanStatus: string, error: ?Error = null) => {
      if (error) {
        logger.critical(error);
      }
      setScanStatus(scanStatus);
      setErr(error);
    },
    [setScanStatus, setErr],
  );

  const handleSetAccountName = useCallback(
    (account: Account, name: string) => {
      setEditedNames(currenEditedNames => ({
        ...currenEditedNames,
        [account.id]: name,
      }));
    },
    [setEditedNames],
  );

  const handleSetScannedAccounts = useCallback(
    ({
      checkedAccountsIds,
      scannedAccounts,
    }: {
      checkedAccountsIds: string[],
      scannedAccounts: Account[],
    }) => {
      setCheckedAccountsIds(checkedAccountsIds || []);
      setScannedAccounts(scannedAccounts || []);
    },
    [setCheckedAccountsIds, setScannedAccounts],
  );

  const handleResetScanState = useCallback(() => {
    setIsAppOpened(false);
    setScanStatus("idle");
    setErr(null);
    setScannedAccounts([]);
    setCheckedAccountsIds([]);
  }, [setIsAppOpened, setScanStatus, setErr, setScannedAccounts, setCheckedAccountsIds]);

  const handleSetAppOpened = useCallback(
    (isAppOpened: boolean) => {
      setIsAppOpened(isAppOpened);
    },
    [setIsAppOpened],
  );

  const handleBeforeOpen = useCallback(
    ({ data }) => {
      if (!currency) {
        if (data && data.currency) {
          setCurrency(data.currency);
        }
      }
    },
    [currency, setCurrency],
  );

  const onGoStep1 = useCallback(() => {
    setStepId("chooseCurrency");
    setIsAppOpened(false);
    setScannedAccounts([]);
    setCheckedAccountsIds([]);
    setEditedNames({});
    setErr(null);
    setScanStatus("idle");
    setReset(currenReset => currenReset + 1);
  }, [
    setStepId,
    setIsAppOpened,
    setScannedAccounts,
    setCheckedAccountsIds,
    setEditedNames,
    setErr,
    setScanStatus,
    setReset,
  ]);

  const onHide = useCallback(() => {
    setStepId("chooseCurrency");
    setIsAppOpened(false);
    setScannedAccounts([]);
    setCheckedAccountsIds([]);
    setEditedNames({});
    setErr(null);
    setScanStatus("idle");
    setReset(0);
  }, [
    setStepId,
    setIsAppOpened,
    setScannedAccounts,
    setCheckedAccountsIds,
    setEditedNames,
    setErr,
    setScanStatus,
    setReset,
  ]);

  const stepperProps = {
    currency,
    device,
    existingAccounts,
    scannedAccounts,
    checkedAccountsIds,
    scanStatus,
    err,
    isAppOpened,
    onClickAdd: handleClickAdd,
    onCloseModal: handleCloseModal,
    setScanStatus: handleSetScanStatus,
    setCurrency: handleSetCurrency,
    setScannedAccounts: handleSetScannedAccounts,
    resetScanState: handleResetScanState,
    setAppOpened: handleSetAppOpened,
    setAccountName: handleSetAccountName,
    onGoStep1: onGoStep1,
    editedNames,
  };

  const title = t("addAccounts.title");

  const errorSteps = err ? [2] : [];

  return (
    <Modal
      centered
      name="MODAL_ADD_ACCOUNTS"
      refocusWhenChange={stepId}
      onHide={onHide}
      onBeforeOpen={handleBeforeOpen}
      preventBackdropClick={stepId === "import"}
      render={({ onClose }) => (
        <Stepper
          key={reset}
          title={title}
          initialStepId="chooseCurrency"
          onStepChange={handleStepChange}
          onClose={onClose}
          steps={steps}
          errorSteps={errorSteps}
          {...stepperProps}
        >
          <Track onUnmount event="CloseModalAddAccounts" />
          <SyncSkipUnderPriority priority={100} />
        </Stepper>
      )}
    />
  );
};

export default AddAccounts;
