// @flow

import React from "react";
import { Trans, useTranslation } from "react-i18next";

import type { Account } from "@ledgerhq/live-common/lib/types";

import Modal, { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Exporter from "~/renderer/components/Exporter";

type OwnProps = {
  isOpen: boolean,
  onClose: () => void,
  accounts?: Account[],
};

type Props = {
  ...OwnProps,
};

const ExportAccountsModal = ({ isOpen, onClose, accounts }: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpened={isOpen}
      onClose={onClose}
      render={({ onClose }: any) => (
        <ModalBody
          onClose={onClose}
          title={t("settings.export.modal.title")}
          render={() => <Exporter accounts={accounts} />}
          renderFooter={() => (
            <Box>
              <Button small onClick={onClose} primary>
                <Trans i18nKey="settings.export.modal.button" />
              </Button>
            </Box>
          )}
        />
      )}
    />
  );
};

export default ExportAccountsModal;
