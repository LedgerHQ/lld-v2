// @flow

import React, { useState, useCallback } from "react";
import Track from "~/renderer/analytics/Track";
import Switch from "~/renderer/components/Switch";

type Props = {
  name: string,
  value: mixed,
  valueOn: mixed,
  valueOff: mixed,
  readOnly: boolean,
  onChange: (name: string, val: mixed) => boolean,
};

const ExperimentalSwitch = ({
  name,
  value,
  valueOn = true,
  valueOff = false,
  readOnly,
  onChange,
}: Props) => {
  const [checked, setChecked] = useState(value === valueOn);

  const handleOnChange = useCallback(
    (evt: boolean) => {
      onChange(name, evt ? valueOn : valueOff);
      setChecked(evt);
    },
    [onChange, valueOn, valueOff, name, setChecked],
  );

  return (
    <>
      <Track onUpdate event={checked ? `${name}Enabled` : `${name}Disabled`} />
      <Switch
        disabled={readOnly}
        isChecked={checked}
        onChange={readOnly ? null : handleOnChange}
        data-e2e={`${name}_button`}
      />
    </>
  );
};

export default ExperimentalSwitch;
