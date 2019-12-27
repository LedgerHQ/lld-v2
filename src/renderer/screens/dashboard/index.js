// @flow
import React from "react";
import ExportOperationsBtn from "~/renderer/components/ExportOperationsBtn";
import Box from "~/renderer/components/Box";

// TODO: REMOVE WHEN DONE
import { useDispatch } from "react-redux";
import { openModal } from "~/renderer/actions/modals";
import Button from "~/renderer/components/Button";

const Dashboard = () => {
  const dispatch = useDispatch();
  return (
    <>
      <h1>Dashboard</h1>
      <Box horizontal>
        <ExportOperationsBtn />
      </Box>
      <Box horizontal>
        <Button onClick={() => dispatch(openModal("MODAL_ADD_ACCOUNTS"))}>Add Accounts</Button>
      </Box>
    </>
  );
};

export default Dashboard;
