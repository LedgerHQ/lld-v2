// @flow
import React from "react";
import ManagerConnect from "~/renderer/components/ManagerConnect";
import Dashboard from "~/renderer/screens/manager/Dashboard";

const Manager = () => <ManagerConnect Success={Dashboard} />;

export default Manager;
