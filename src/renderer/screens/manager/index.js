// @flow
import React from "react";
import Dashboard from "~/renderer/screens/manager/Dashboard";
import SyncSkipUnderPriority from "~/renderer/components/SyncSkipUnderPriority";
import DeviceAction from "~/renderer/components/DeviceAction";
import { action } from "~/renderer/components/DeviceAction/actions/manager";

const Manager = () => (
  <>
    <SyncSkipUnderPriority priority={999} />
    <DeviceAction Result={Dashboard} action={action} request={null} />;
  </>
);
export default Manager;
