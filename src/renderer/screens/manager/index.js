// @flow
import React from "react";
import DeviceAction from "~/renderer/components/DeviceAction";
import { config } from "~/renderer/components/DeviceAction/actions/manager";
import Dashboard from "~/renderer/screens/manager/Dashboard";

const Manager = () => <DeviceAction Success={Dashboard} config={config} request={null} />;

export default Manager;
