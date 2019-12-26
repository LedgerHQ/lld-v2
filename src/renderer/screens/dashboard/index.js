// @flow
import React from "react";
import ExportOperationsBtn from "~/renderer/components/ExportOperationsBtn";
import Box from "~/renderer/components/Box";

const Dashboard = () => (
  <>
    <h1>Dashboard</h1>
    <Box horizontal>
      <ExportOperationsBtn />
    </Box>
  </>
);

export default Dashboard;
