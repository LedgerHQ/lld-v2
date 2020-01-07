// @flow
import React from "react";
import { connect } from "react-redux";
import { openModal } from "~/renderer/actions/modals";
import Button from "~/renderer/components/Button";

const Accounts = ({ dispatch }: { dispatch: (*) => void }) => (
  <>
    <h1>Accounts</h1>
    <Button onClick={() => dispatch(openModal("MODAL_ADD_ACCOUNTS"))}>Add Accounts</Button>
  </>
);

const screen: React$ComponentType<{}> = connect()(Accounts);

export default screen;
