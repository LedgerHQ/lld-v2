// @flow

import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { balanceHistoryWithCountervalueSelector } from "~/renderer/actions/portfolio";
import type { Account, TokenAccount, PortfolioRange } from "@ledgerhq/live-common/lib/types";
import { getCurrencyColor } from "~/renderer/getCurrencyColor";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import Box from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import CounterValue from "~/renderer/components/CounterValue";
import Chart from "~/renderer/components/Chart";
import useTheme from "~/renderer/hooks/useTheme";

const Placeholder = styled.div`
  height: 14px;
`;

type Props = {
  account: Account | TokenAccount,
  range: PortfolioRange,
};

// $FlowFixMe
const mapValueCounterValue = d => d.countervalue.toNumber();
const mapValue = d => d.value.toNumber();

const Body = ({ account, range }: Props) => {
  const { history, countervalueAvailable, countervalueChange } = useSelector(state =>
    balanceHistoryWithCountervalueSelector(state, { account, range }),
  );
  const bgColor = useTheme("theme.colors.palette.background.paper");
  const currency = getAccountCurrency(account);

  return (
    <Box flow={4}>
      <Box flow={2} horizontal>
        <Box justifyContent="center">
          <CounterValue
            currency={currency}
            value={history[history.length - 1].value}
            animateTicker={false}
            alwaysShowSign={false}
            showCode
            fontSize={3}
            placeholder={<Placeholder />}
            color="palette.text.shade80"
          />
        </Box>
        <Box grow justifyContent="center">
          {!countervalueChange.percentage ? null : (
            <FormattedVal
              isPercent
              val={countervalueChange.percentage.times(100).integerValue()}
              alwaysShowSign
              fontSize={3}
            />
          )}
        </Box>
      </Box>
      <Chart
        data={history}
        color={getCurrencyColor(currency, bgColor)}
        mapValue={countervalueAvailable ? mapValueCounterValue : mapValue}
        height={52}
        hideAxis
        isInteractive={false}
        id={`account-chart-${account.id}`}
      />
    </Box>
  );
};

const m: React$ComponentType<Props> = React.memo(Body);

export default m;
