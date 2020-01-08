// @flow

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";
import Text from "~/renderer/components/Text";
import Card from "~/renderer/components/Box/Card";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";
import Box from "~/renderer/components/Box";
import Header from "./Header";
import Row from "./Row";
import type { AccountDistributionItem } from "./Row";
import { calculateCountervalueSelector } from "~/renderer/actions/general";

type Props = {
  accountDistribution: AccountDistributionItem[],
};

type State = {};

const mapStateToProps = (state, props) => {
  const { accounts } = props;
  const total = accounts.reduce((total, a) => total.plus(a.balance), BigNumber(0));

  return {
    accountDistribution: accounts
      .map(a => ({
        account: a,
        currency: getAccountCurrency(a),
        distribution: a.balance.div(total).toFixed(2),
        amount: a.balance,
        countervalue: calculateCountervalueSelector(state)(getAccountCurrency(a), a.balance),
      }))
      .sort((a, b) => b.distribution - a.distribution),
    counterValueCurrency: counterValueCurrencySelector,
  };
};

class AccountDistribution extends PureComponent<Props, State> {
  render() {
    const { accountDistribution } = this.props;
    return (
      <>
        <Box horizontal alignItems="center">
          <Text ff="Inter|Medium" fontSize={6} color="palette.text.shade100">
            <Trans
              i18nKey="accountDistribution.header"
              values={{ count: accountDistribution.length }}
              count={accountDistribution.length}
            />
          </Text>
        </Box>

        <Card p={0} mt={20}>
          <Header />
          {accountDistribution.map(item => (
            <Row key={item.account.id} item={item} />
          ))}
        </Card>
      </>
    );
  }
}

const ConnectedAccountDistribution: React$ComponentType<{}> = connect(mapStateToProps)(
  AccountDistribution,
);
export default ConnectedAccountDistribution;
