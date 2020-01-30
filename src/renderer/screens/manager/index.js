// @flow
import React from "react";
import DeviceConnect from "~/renderer/components/DeviceConnect";
import { config } from "~/renderer/components/DeviceConnect/configs/manager";
import Dashboard from "~/renderer/screens/manager/Dashboard";

const Manager = () => <DeviceConnect Success={Dashboard} config={config} request={null} />;

export default Manager;
