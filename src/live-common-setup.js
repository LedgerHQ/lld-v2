// @flow
import "./env";
import WebSocket from "ws";
import "@ledgerhq/live-common/lib/load/tokens/ethereum/erc20";
import { listen as listenLogs } from "@ledgerhq/logs";
import { setEnv } from "@ledgerhq/live-common/lib/env";
import { logs as websocketLogs } from "@ledgerhq/live-common/lib/api/socket";
import { setNetwork, setWebSocketImplementation } from "@ledgerhq/live-common/lib/network";
import logger from "./logger";
import network from "./network";

import "./live-common-set-supported-currencies";

setEnv("DEVICE_CANCEL_APDU_FLUSH_MECHANISM", false);

setWebSocketImplementation(WebSocket);
setNetwork(network);
listenLogs(({ id, date, ...log }) => {
  if (log.type === "hid-frame") return;
  logger.debug(log);
});
websocketLogs.subscribe(({ type, message, ...rest }) => {
  const obj = rest;
  if (message) obj.msg = message;
  logger.websocket(type, obj);
});
