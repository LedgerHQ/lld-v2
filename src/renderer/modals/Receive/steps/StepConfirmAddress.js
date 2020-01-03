// @flow
import React, { PureComponent } from "react";
import styled from "styled-components";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account/helpers";
import TrackPage from "~/renderer/analytics/TrackPage";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import ExternalLinkButton from "~/renderer/components/ExternalLinkButton";
import RetryButton from "~/renderer/components/RetryButton";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import Interactions from "~/renderer/icons/device/interactions";

import TranslatedError from "~/renderer/components/TranslatedError";
import DebugAppInfosForCurrency from "~/renderer/components/DebugAppInfosForCurrency";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { StepProps } from "../Body";

export default class StepConfirmAddress extends PureComponent<StepProps> {
  render() {
    const { t, account, isAddressVerified, verifyAddressError, transitionTo, device } = this.props;
    const isBlue = device && device.modelId === "blue";
    const currency = account ? getAccountCurrency(account) : null;

    return (
      <Container>
        <TrackPage category="Receive Flow" name="Step 3" />
        {isAddressVerified === false ? (
          <>
            {account ? <DebugAppInfosForCurrency /> : null}
            <TrackPage category="Receive Flow" name="Step 3 Address Not Verified Error" />
            <Title>
              <TranslatedError error={verifyAddressError} />
            </Title>
            <Text mb={5}>
              <TranslatedError error={verifyAddressError} field="description" />
            </Text>
            {!device ? null : (
              <Box pt={isBlue ? 2 : null}>
                <Interactions
                  type={device.modelId}
                  error={verifyAddressError}
                  width={isBlue ? 120 : 375}
                  wire="wired"
                />
              </Box>
            )}
          </>
        ) : (
          <>
            <Title>{t("receive.steps.confirmAddress.action")}</Title>
            <Text>
              {currency
                ? t("receive.steps.confirmAddress.text", { currencyName: currency.name })
                : null}
            </Text>
            <LinkWithExternalIcon
              onClick={() => openURL(urls.recipientAddressInfo)}
              label={t("common.learnMore")}
            />
            <Button mt={4} mb={2} primary onClick={() => transitionTo("receive")}>
              {t("common.continue")}
            </Button>
            {!device ? null : (
              <Box pt={isBlue ? 4 : null}>
                <Interactions
                  type={device.modelId}
                  screen="validation"
                  error={verifyAddressError}
                  width={isBlue ? 120 : 375}
                  wire="wired"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    );
  }
}

export function StepConfirmAddressFooter({ t, transitionTo, onRetry }: StepProps) {
  // This will be displayed only if user rejected address
  return (
    <>
      <ExternalLinkButton
        event="Receive Flow Step 3 Contact Us Clicked"
        label={t("receive.steps.confirmAddress.support")}
        url={urls.contactSupport}
      />
      <RetryButton
        ml={2}
        primary
        event="Receive Flow Step 3 Retry Clicked"
        onClick={() => {
          onRetry();
          transitionTo("device");
        }}
      />
    </>
  );
}

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  alignItems: "center",
  fontSize: 4,
  color: "palette.text.shade100",
  px: 5,
  mb: 2,
}))``;

const Title = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
  fontSize: 6,
  mb: 1,
}))``;

const Text = styled(Box).attrs(() => ({
  color: "palette.text.shade80",
}))`
  text-align: center;
`;
