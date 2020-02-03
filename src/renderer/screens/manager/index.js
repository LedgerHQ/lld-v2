// @flow
import React from "react";
import DeviceAction from "~/renderer/components/DeviceAction";
import { action } from "~/renderer/components/DeviceAction/actions/manager";
import Dashboard from "~/renderer/screens/manager/Dashboard";

const Manager = () => <DeviceAction Result={Dashboard} action={action} request={null} />;

export default Manager;
