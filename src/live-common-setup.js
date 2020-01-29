// @flow
import "./env";
import WebSocket from "ws";
import "@ledgerhq/live-common/lib/load/tokens/ethereum/erc20";
import { listen as listenLogs } from "@ledgerhq/logs";
import { setNetwork, setWebSocketImplementation } from "@ledgerhq/live-common/lib/network";
import logger from "./logger";
import network from "./network";

import "./live-common-set-supported-currencies";

setWebSocketImplementation(WebSocket);
setNetwork(network);
listenLogs(({ id, date, ...log }) => {
  if (log.type === "hid-frame") return;
  logger.debug(log);
});
