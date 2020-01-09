// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import { getAccountUnit, getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import type { AccountLike } from "@ledgerhq/live-common/lib/types";
import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import { CurrencyCircleIcon } from "~/renderer/components/CurrencyBadge";
import FormattedVal from "~/renderer/components/FormattedVal";

type Props = {
  account: AccountLike,
};

const AccountFooter = ({ account }: Props) => {
  const { t } = useTranslation();
  const accountUnit = getAccountUnit(account);
  const currency = getAccountCurrency(account);
  return (
    <Box flow={2} horizontal flex={1}>
      <CurrencyCircleIcon size={40} currency={currency} />
      <Box grow>
        <Label>{t("send.totalBalance")}</Label>
        {accountUnit && (
          <FormattedVal
            style={{ width: "auto" }}
            color="palette.text.shade100"
            val={account.balance}
            unit={accountUnit}
            showCode
          />
        )}
      </Box>
    </Box>
  );
};

export default AccountFooter;
