// @flow
import React from "react";
import ManagerConnect from "~/renderer/components/ManagerConnect";
import SyncSkipUnderPriority from "~/renderer/components/SyncSkipUnderPriority";
import Dashboard from "~/renderer/screens/manager/Dashboard";

const Manager = () => (
  <>
    <SyncSkipUnderPriority priority={999} />
    <ManagerConnect Success={Dashboard} />
  </>
);

export default Manager;
