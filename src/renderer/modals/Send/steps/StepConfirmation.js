// @flow

import React from "react";
import { Trans } from "react-i18next";
import styled, { withTheme } from "styled-components";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import DebugAppInfosForCurrency from "~/renderer/components/DebugAppInfosForCurrency";
import RetryButton from "~/renderer/components/RetryButton";
import Spinner from "~/renderer/components/Spinner";
import TranslatedError from "~/renderer/components/TranslatedError";
import IconCheckCircle from "~/renderer/icons/CheckCircle";
import IconExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";
import IconTriangleWarning from "~/renderer/icons/TriangleWarning";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { multiline } from "~/renderer/styles/helpers";

import type { StepProps } from "../types";

const Container: ThemedComponent<{ shouldSpace: boolean }> = styled(Box).attrs(() => ({
  alignItems: "center",
  grow: true,
  color: "palette.text.shade100",
}))`
  justify-content: ${p => (p.shouldSpace ? "space-between" : "center")};
  min-height: 220px;
`;

const Title: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter",
  fontSize: 5,
  mt: 2,
}))`
  text-align: center;
  word-break: break-word;
`;

const Text: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter",
  fontSize: 4,
  mt: 2,
}))`
  text-align: center;
`;

const Disclaimer: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
  color: "palette.background.paper",
  borderRadius: 1,
  p: 3,
  mb: 5,
}))`
  width: 100%;
  background-color: ${p => p.theme.colors.lightRed};
  color: ${p => p.theme.colors.alertRed};
`;

// TODO the "broadcasting" step need to be split out in another step, or at least a component
function StepConfirmation({
  account,
  t,
  optimisticOperation,
  error,
  signed,
  theme,
}: StepProps & { theme: * }) {
  const Icon = optimisticOperation ? IconCheckCircle : error ? IconExclamationCircleThin : Spinner;
  const iconColor = optimisticOperation
    ? theme.colors.positiveGreen
    : error
    ? theme.colors.alertRed
    : theme.colors.palette.text.shade60;

  const broadcastError = error && signed;

  return (
    <Container shouldSpace={broadcastError}>
      {error && account ? <DebugAppInfosForCurrency /> : null}
      {broadcastError ? (
        <Disclaimer>
          <Box mr={3}>
            <IconTriangleWarning height={16} width={16} />
          </Box>
          <Box style={{ display: "block" }} ff="Inter|SemiBold" fontSize={3} horizontal shrink>
            <Trans i18nKey="send.steps.confirmation.broadcastError" />
          </Box>
        </Disclaimer>
      ) : null}
      <TrackPage category="Send Flow" name="Step Confirmed" />
      <span style={{ color: iconColor }}>
        <Icon size={43} />
      </span>
      <Title>
        {error ? (
          <TranslatedError error={error} />
        ) : optimisticOperation ? (
          <Trans i18nKey="send.steps.confirmation.success.title" />
        ) : (
          <Trans i18nKey="send.steps.confirmation.pending.title" />
        )}
      </Title>
      <Text style={{ userSelect: "text" }} color="palette.text.shade80">
        {optimisticOperation ? (
          multiline(t("send.steps.confirmation.success.text"))
        ) : error ? (
          <TranslatedError error={error} field="description" />
        ) : null}
      </Text>
    </Container>
  );
}

export function StepConfirmationFooter({
  t,
  transitionTo,
  account,
  parentAccount,
  onRetry,
  optimisticOperation,
  error,
  openModal,
  closeModal,
}: StepProps) {
  const concernedOperation = optimisticOperation
    ? optimisticOperation.subOperations && optimisticOperation.subOperations.length > 0
      ? optimisticOperation.subOperations[0]
      : optimisticOperation
    : null;
  return (
    <>
      {concernedOperation ? (
        <Button
          ml={2}
          event="Send Flow Step 4 View OpD Clicked"
          onClick={() => {
            closeModal();
            if (account && concernedOperation) {
              openModal("MODAL_OPERATION_DETAILS", {
                operationId: concernedOperation.id,
                accountId: account.id,
                parentId: parentAccount && parentAccount.id,
              });
            }
          }}
          primary
        >
          {t("send.steps.confirmation.success.cta")}
        </Button>
      ) : error ? (
        <RetryButton
          ml={2}
          primary
          onClick={() => {
            onRetry();
            transitionTo("summary");
          }}
        />
      ) : null}
    </>
  );
}

export default withTheme(StepConfirmation);
