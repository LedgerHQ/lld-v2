// @flow

import React from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";

import Modal, { ModalBody } from "~/renderer/components/Modal";
import ManagerConnect from "~/renderer/components/ManagerConnect";

const Container = styled.div`
  min-height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

type Props = {
  isOpened: boolean,
  onClose: () => void,
  Success: React$ComponentType<*>,
};

const GenuineCheckModal = ({ isOpened, onClose, Success }: Props) => {
  return (
    <Modal
      isOpened={isOpened}
      onClose={onClose}
      width={600}
      render={({ onClose }) => (
        <ModalBody
          onClose={onClose}
          title={<Trans i18nKey="genuinecheck.modal.title" />}
          render={() => (
            <Container>
              <ManagerConnect Success={Success} />
            </Container>
          )}
        />
      )}
    />
  );
};

export default GenuineCheckModal;
