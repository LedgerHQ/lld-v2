// @flow
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import styled, { withTheme } from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import TrackPage from "~/renderer/analytics/TrackPage";
import Spinner from "~/renderer/components/Spinner";
import TransactionConfirm from "~/renderer/components/TransactionConfirm";
import Box from "~/renderer/components/Box";

import type { StepProps } from "../types";

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  alignItems: "center",
  grow: true,
  color: "palette.text.shade100",
}))`
  justify-content: center;
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

class StepVerification extends PureComponent<StepProps & { theme: * }> {
  componentDidMount() {
    this.signTransaction();
  }

  signTransaction = async () => {
    const { transitionTo } = this.props;
    // TODO: not very good pattern to pass transitionTo... Stepper needs to be
    // controlled
    this.props.signTransaction({ transitionTo });
  };

  render() {
    const {
      device,
      account,
      parentAccount,
      transaction,
      lastSignOperationEvent,
      status,
      theme,
    } = this.props;

    if (!account || !device || !transaction) return null;

    return (
      <>
        <TrackPage category="Send Flow" name="Step Verification" />
        {lastSignOperationEvent && lastSignOperationEvent.type === "device-signature-requested" ? (
          // we need to ask user to confirm the details
          <TransactionConfirm
            device={device}
            account={account}
            parentAccount={parentAccount}
            transaction={transaction}
            status={status}
          />
        ) : (
          <Container>
            <span style={{ color: theme.colors.palette.text.shade60 }}>
              <Spinner size={43} />
            </span>

            <Title>
              {lastSignOperationEvent && lastSignOperationEvent.type === "device-streaming" ? (
                // with streaming event, we have accurate version of the wording
                <Trans
                  i18nKey="send.steps.verification.streaming.accurate"
                  values={lastSignOperationEvent}
                />
              ) : (
                // otherwise, we're not accurate (usually because we don't need to, it's fast case)
                <Trans i18nKey="send.steps.verification.streaming.inaccurate" />
              )}
            </Title>
          </Container>
        )}
      </>
    );
  }
}

export default withTheme(StepVerification);
