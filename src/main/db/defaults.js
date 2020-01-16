// @flow

const config = {
  accounts: [],
  counterValue: "USD",
  language: null,
  theme: "dusk",
  region: null,
  orderAccounts: "balance|desc",
  countervalueFirst: true,
  hasPassword: false,
  autoLockTimeout: 10,
  selectedTimeRange: "week",
  marketIndicator: "western",
  currenciesSettings: {},
  pairExchanges: {},
  developerMode: false,
  loaded: true,
  shareAnalytics: true,
  sentryLogs: true,
  lastUsedVersion: "1.18.2",
  dismissedBanners: [],
  accountsViewMode: "card",
  showAccountsHelperBanner: true,
  hideEmptyTokenAccounts: false,
  sidebarCollapsed: false,
};

const cache = {
  countervalues: {
    version: 1,
    rates: {},
  },
};

const accounts = [];

export default {
  config,
  cache,
  accounts,
};
