// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import styled, { withTheme } from "styled-components";

import type { Currency } from "@ledgerhq/live-common/lib/types";

import { rgba } from "~/renderer/styles/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Tooltip from "~/renderer/components/Tooltip";
import Text from "~/renderer/components/Text";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";

const ParentCryptoCurrencyIconWrapper: ThemedComponent<{
  doubleIcon?: boolean,
  bigger?: boolean,
}> = styled.div`
  ${p =>
    p.doubleIcon
      ? `
  > :nth-child(1) {
    clip-path: polygon(0% 0%, 100% 0%, 100% 50%, 81% 50%, 68% 54%, 58% 63%, 52% 74%, 50% 86%, 50% 100%, 0% 100%);
  }`
      : `
  display: flex;
  align-items: center;`}

  line-height: ${p => (p.bigger ? "18px" : "18px")};
  font-size: ${p => (p.bigger ? "12px" : "12px")};
  > :nth-child(2) {
    margin-top: ${p => (p.bigger ? "-15px" : "-13px")};
    margin-left: ${p => (p.bigger ? "10px" : "8px")};
    border: 2px solid transparent;
  }
`;
const TooltipWrapper = styled.div`
  display: flex;
  max-width: 150px;
  flex-direction: column;
`;

const CryptoCurrencyIconTooltip = withTheme(({ name, theme }: { theme: any, name: string }) => {
  const { t } = useTranslation();
  return (
    <TooltipWrapper>
      <Text color={rgba(theme.colors.palette.background.paper, 0.5)}>
        {t("tokensList.tooltip")}
      </Text>
      <Text>{name}</Text>
    </TooltipWrapper>
  );
});

type Props = {
  currency: Currency,
  withTooltip?: boolean,
  bigger?: boolean,
  inactive?: boolean,
};

const ParentCryptoCurrencyIcon = ({ currency, withTooltip, bigger, inactive }: Props) => {
  const parent = currency.type === "TokenCurrency" ? currency.parentCurrency : null;

  const content = (
    <ParentCryptoCurrencyIconWrapper doubleIcon={!!parent} bigger={bigger}>
      {parent && (
        <CryptoCurrencyIcon inactive={inactive} currency={parent} size={bigger ? 20 : 16} />
      )}
      <CryptoCurrencyIcon inactive={inactive} currency={currency} size={bigger ? 20 : 16} />
    </ParentCryptoCurrencyIconWrapper>
  );

  if (withTooltip && parent) {
    return <Tooltip content={<CryptoCurrencyIconTooltip name={parent.name} />}>{content}</Tooltip>;
  }

  return content;
};

export default ParentCryptoCurrencyIcon;
