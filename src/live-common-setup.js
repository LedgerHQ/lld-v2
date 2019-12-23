// @flow
import "./env";

import WebSocket from "ws";
import "@ledgerhq/live-common/lib/load/tokens/ethereum/erc20";
import { setNetwork, setWebSocketImplementation } from "@ledgerhq/live-common/lib/network";
import network from "./network";

import "./live-common-set-supported-currencies";

setWebSocketImplementation(WebSocket);
setNetwork(network);
