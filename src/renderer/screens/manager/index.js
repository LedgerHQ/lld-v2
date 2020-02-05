// @flow
import React, { useState, useCallback } from "react";
import ManagerConnect from "~/renderer/components/ManagerConnect";
import SyncSkipUnderPriority from "~/renderer/components/SyncSkipUnderPriority";
import Dashboard from "~/renderer/screens/manager/Dashboard";

const Manager = () => {
  const [success, setSuccess] = useState(null);
  const onReset = useCallback(() => setSuccess(null), [setSuccess]);
  /**
   * we detect a device connection success and save the state here to show the dashboard
   * we can reset this state and go back to device connection steps from the dashboard
   * @TODO review these changes against DeviceConnection updates
   */
  return (
    <>
      <SyncSkipUnderPriority priority={999} />
      {success ? (
        <Dashboard {...success} onReset={onReset} />
      ) : (
        <ManagerConnect onSuccess={setSuccess} Success={Dashboard} />
      )}
    </>
  );
};

export default Manager;
