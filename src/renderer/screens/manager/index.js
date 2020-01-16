// @flow
import React from "react";
import styled from "styled-components";
import ManagerConnect from "~/renderer/components/ManagerConnect";
import Dashboard from "~/renderer/screens/manager/Dashboard";

/* FIXME not fan of the Default Main idea that force the padding top... we don't want it here */
const CompensateAlignment: any = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: ${p => -p.theme.space[6]}px;
`;

const Manager = () => (
  <CompensateAlignment>
    <ManagerConnect edges={180} Success={Dashboard} />
  </CompensateAlignment>
);

export default Manager;
