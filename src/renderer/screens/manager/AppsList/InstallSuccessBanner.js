// @flow
import React, { useState, useEffect, useCallback, useRef, memo } from "react";

import styled from "styled-components";

import { Trans } from "react-i18next";

import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { isCurrencySupported } from "@ledgerhq/live-common/lib/data/cryptocurrencies";

import type { State, Action } from "@ledgerhq/live-common/lib/apps/types";

import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box/Box";
import FadeInOutBox from "~/renderer/components/FadeInOutBox";
import IconCross from "~/renderer/icons/Cross";

import Button from "~/renderer/components/Button";

const IconContainer = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
  p: 4,
}))`
  position: absolute;
  top: 0;
  right: 0;

  cursor: pointer;
`;

const LogoContainer = styled(Box).attrs(() => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}))`
  position: absolute;
  top: 10px;
  left: 20px;

  ${IconContainer} {
    width: 100%;
    max-width: 110px;
  }
`;

const Container = styled.div`
  position: relative;
`;

type Props = {
  state: State,
  dispatch: Action => void,
  isIncomplete: boolean,
  addAccount: (*) => void,
};

let installs = new Set([]);

const InstallSuccessBanner = ({ state, isIncomplete, dispatch, addAccount }: Props) => {
  const cardRef = useRef();
  const [installSuccess, setInstallSuccess] = useState([]);
  const { installQueue, uninstallQueue, installed, appByName } = state;

  const onAddAccount = useCallback(() => {
    if (installSuccess[0].currencyId)
      addAccount(getCryptoCurrencyById(installSuccess[0].currencyId));
  }, [addAccount, installSuccess]);

  const onInstallSuccess = useCallback(() => {
    const installArray = Array.from(installs)
      .map(n => appByName[n])
      .filter(
        app =>
          app &&
          app.currencyId &&
          isCurrencySupported(getCryptoCurrencyById(app.currencyId)) &&
          installed.findIndex(ins => ins.name === app.name) >= 0,
      );
    setInstallSuccess(installArray || []);
    installs = new Set([]);
    console.log(cardRef);
    if (installArray.length && cardRef && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [appByName, installed]);

  useEffect(() => {
    if (installQueue.length > 0) {
      installs = new Set([...installs, ...installQueue]);
      setInstallSuccess([]);
    } else {
      setTimeout(onInstallSuccess, 200);
    }
  }, [installQueue, onInstallSuccess]);

  useEffect(() => {
    if (uninstallQueue.length > 0 && installSuccess.length > 0) {
      setInstallSuccess([]);
      installs = new Set([]);
    }
  }, [installSuccess.length, uninstallQueue]);

  const onClose = useCallback(() => setInstallSuccess([]), [setInstallSuccess]);

  return (
    <Container ref={cardRef}>
      <FadeInOutBox
        in={installSuccess.length > 0}
        bg="palette.primary.main"
        color="palette.primary.contrastText"
        borderRadius={1}
      >
        <Box horizontal px={6} py={3}>
          <IconContainer style={{ zIndex: 10 }} onClick={onClose}>
            <IconCross size={16} />
          </IconContainer>
          <Box style={{ zIndex: 10 }} flex={1} justifyContent="space-between">
            <Box mb={24}>
              <Text
                ff="Inter|SemiBold"
                fontSize={6}
                color="palette.primary.contrastText"
                style={{ maxWidth: 320 }}
              >
                {installSuccess.length === 1 ? (
                  <Trans
                    i18nKey="manager.applist.installSuccess.title"
                    values={{ app: installSuccess[0].name }}
                  />
                ) : (
                  <Trans i18nKey="manager.applist.installSuccess.title_plural" />
                )}
              </Text>
            </Box>
            <Box horizontal>
              <Button primary inverted onClick={onAddAccount} mr={1}>
                <Trans i18nKey="manager.applist.installSuccess.manageAccount" />
              </Button>
              <Button onClick={onClose} color="palette.primary.contrastText">
                <Trans i18nKey="manager.applist.installSuccess.later" />
              </Button>
            </Box>
          </Box>
        </Box>
      </FadeInOutBox>
    </Container>
  );
};

export default memo<Props>(InstallSuccessBanner);
