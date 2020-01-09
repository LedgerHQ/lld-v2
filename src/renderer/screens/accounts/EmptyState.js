// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { openModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
// TODO rework Image component
// import Image from "~/renderer/components/Image";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const handleInstallApp = () => {
  const { push } = useHistory();

  push("/manager");
};

const EmptyState = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <Box alignItems="center" pb={8} style={{ margin: "auto" }}>
      {/* <Image
        alt="emptyState Dashboard logo"
        resource="empty-state-accounts.svg"
        width="500"
        themeTyped
      /> */}
      <Box mt={5} alignItems="center">
        <Title data-e2e="dashboard_empty_title">{t("emptyState.dashboard.title")}</Title>
        <Description mt={3} style={{ maxWidth: 600 }}>
          {t("emptyState.dashboard.desc")}
        </Description>
        <Box mt={5} horizontal style={{ width: 300 }} flow={3} justifyContent="center">
          <Button
            primary
            style={{ minWidth: 120 }}
            onClick={handleInstallApp}
            data-e2e="dashboard_empty_OpenManager"
          >
            {t("emptyState.dashboard.buttons.installApp")}
          </Button>
          <Button
            outline
            style={{ minWidth: 120 }}
            onClick={() => dispatch(openModal("MODAL_ADD_ACCOUNTS"))}
            data-e2e="dashboard_empty_AddAccounts"
          >
            {t("emptyState.dashboard.buttons.addAccount")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export const Title: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: 6,
  color: p => p.theme.colors.palette.text.shade100,
}))``;

export const Description: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: 4,
  color: p => p.theme.colors.palette.text.shade80,
  textAlign: "center",
}))``;

export default EmptyState;
