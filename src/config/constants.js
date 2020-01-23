// @flow

/// DEPRECATED ///

// PLEASE READ:
// do not add new envs here!
// the idea is we want either collocation (put the process.env. in place where you need it)
// otherwise, the env MUST be in live-common (if it's a general concept that can be between mobile/desktop or concerns the logic)

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

const intFromEnv = (key: string, def: number): number => {
  const v = process.env[key];
  if (!isNaN(v)) return parseInt(v, 10);
  return def;
};

const boolFromEnv = (key: string, def: boolean = false): boolean => {
  const v = process.env[key];
  if (typeof v === "string") return !(v === "0" || v === "false");
  return def;
};

// Size

// move it in main process code where it is used. no need to override it by CLI.
export const DEFAULT_WINDOW_WIDTH = intFromEnv("LEDGER_DEFAULT_WINDOW_WIDTH", 1024);
export const DEFAULT_WINDOW_HEIGHT = intFromEnv("LEDGER_DEFAULT_WINDOW_HEIGHT", 768);
export const MIN_WIDTH = intFromEnv("LEDGER_MIN_WIDTH", 1024);
export const MIN_HEIGHT = intFromEnv("LEDGER_MIN_HEIGHT", 700);
export const MAIN_SIDEBAR_WIDTH = 230;

// time and delays...

// move it in update logic
export const CHECK_UPDATE_DELAY = 5000;

// use getEnv()
export const GET_CALLS_RETRY = intFromEnv("GET_CALLS_RETRY", 2);
export const GET_CALLS_TIMEOUT = intFromEnv("GET_CALLS_TIMEOUT", 30 * 1000);

// use getEnv('SYNC_OUTDATED_CONSIDERED_DELAY') (incoming live-common version)
export const OUTDATED_CONSIDERED_DELAY = intFromEnv("OUTDATED_CONSIDERED_DELAY", 2 * 60 * 1000);

// use getEnv()
export const SYNC_ALL_INTERVAL = 120 * 1000;
export const SYNC_BOOT_DELAY = 2 * 1000;
export const SYNC_PENDING_INTERVAL = 10 * 1000;
export const SYNC_MAX_CONCURRENT = intFromEnv("LEDGER_SYNC_MAX_CONCURRENT", 4);

// DROP the idea (code it yourself when you need this)
export const DEBUG_TICK_REDUX = intFromEnv("DEBUG_TICK_REDUX", 0);

// Flags
export const DISABLE_TICKER_ANIMATION = boolFromEnv("DISABLE_TICKER_ANIMATION");
export const DISABLE_CONTEXT_MENU = boolFromEnv("DISABLE_CONTEXT_MENU");

// please inline in logger. process.env.DEBUG_...
export const DEBUG_ANALYTICS = boolFromEnv("DEBUG_ANALYTICS");
export const DEBUG_DEVICE = boolFromEnv("DEBUG_DEVICE");
export const DEBUG_NETWORK = boolFromEnv("DEBUG_NETWORK");
export const DEBUG_COMMANDS = boolFromEnv("DEBUG_COMMANDS");
export const DEBUG_DB = boolFromEnv("DEBUG_DB");
export const DEBUG_ACTION = boolFromEnv("DEBUG_ACTION");
export const DEBUG_TAB_KEY = boolFromEnv("DEBUG_TAB_KEY");
export const DEBUG_LIBCORE = boolFromEnv("DEBUG_LIBCORE");
export const DEBUG_WS = boolFromEnv("DEBUG_WS");
export const DEBUG_SYNC = boolFromEnv("DEBUG_SYNC");

// just inline process.env.DEV_TOOLS
export const DEV_TOOLS = boolFromEnv("DEV_TOOLS");

// getEnv()
export const SKIP_ONBOARDING = boolFromEnv("SKIP_ONBOARDING");

// TODO investigate if it's ever needed, drop it otherwise
export const SHOW_MOCK_HSMWARNINGS = boolFromEnv("SHOW_MOCK_HSMWARNINGS");

// DROP: I suggest we always warn in __DEV__ mode
export const WARN_LEGACY_COLORS = boolFromEnv("WARN_LEGACY_COLORS");

// DROP? i'm not sure why we want to disable
export const DISABLE_ACTIVITY_INDICATORS = boolFromEnv("DISABLE_ACTIVITY_INDICATORS");

// investigate what is this and if we can make it not experimental?
export const EXPERIMENTAL_WS_EXPORT = boolFromEnv("EXPERIMENTAL_WS_EXPORT");

// Drop the feature unless Ben think we want it back.
export const EXPERIMENTAL_MARKET_INDICATOR_SETTINGS = boolFromEnv(
  "EXPERIMENTAL_MARKET_INDICATOR_SETTINGS",
);

// getEnv
export const MAX_ACCOUNT_NAME_SIZE = 50;
