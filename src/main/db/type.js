// @flow

export type Config = {
  data: {
    accounts: [],
    counterValue: string,
    language: null,
    theme: string,
    region: null,
    orderAccounts: string,
    countervalueFirst: boolean,
    hasPassword: boolean,
    autoLockTimeout: number,
    selectedTimeRange: string,
    marketIndicator: string,
    currenciesSettings: {},
    pairExchanges: {},
    developerMode: boolean,
    loaded: boolean,
    shareAnalytics: boolean,
    sentryLogs: boolean,
    lastUsedVersion: string,
    dismissedBanners: [],
    accountsViewMode: string,
    showAccountsHelperBanner: boolean,
    hideEmptyTokenAccounts: boolean,
    sidebarCollapsed: boolean,
  },
  countervalues: {
    version: number,
    rates: {},
  },
};
