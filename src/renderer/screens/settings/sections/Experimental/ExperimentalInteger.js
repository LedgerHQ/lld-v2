// @flow

import React, { useCallback, useState, useEffect } from "react";
import Track from "~/renderer/analytics/Track";
import Switch from "~/renderer/components/Switch";
import Input from "~/renderer/components/Input";
import Box from "~/renderer/components/Box";

type Props = {
  name: *,
  readOnly: boolean,
  value: number,
  minValue: number,
  maxValue: number,
  defaultValue: Number,
  onChange: (name: string, val: mixed) => boolean,
};

const ExperimentalInteger = ({
  name,
  readOnly,
  onChange,
  value,
  minValue,
  maxValue,
  defaultValue,
}: Props) => {
  const constraintValue = useCallback(
    v => {
      let value = v;
      if (typeof maxValue === "number" && value > maxValue) value = maxValue;
      if (typeof minValue === "number" && value < minValue) value = minValue;
      return value;
    },
    [minValue, maxValue],
  );

  const [enabled, setEnabled] = useState(value !== defaultValue);
  const [inputValue, setInputValue] = useState(String(constraintValue(value)));

  useEffect(() => {
    if (!enabled) {
      setInputValue(constraintValue(value));
    }
  }, [enabled, value, setInputValue, constraintValue]);

  const onInputChange = useCallback(
    str => {
      if (!enabled) return;
      const sanitized = str.replace(/[^0-9]/g, "");
      if (sanitized.length > 0) {
        const parsed = constraintValue(parseInt(sanitized, 10));
        onChange(name, parsed);
      }
      setInputValue(sanitized);
    },
    [name, onChange, constraintValue, enabled],
  );

  const onEnableChange = useCallback(
    e => {
      setEnabled(!!e);
      if (e) {
        onChange(name, constraintValue(value));
      } else {
        onChange(name, defaultValue);
      }
    },
    [onChange, name, constraintValue, value, defaultValue],
  );

  return (
    <>
      <Track onUpdate event={enabled ? `${name}Enabled` : `${name}Disabled`} />

      <Box grow horizontal flow={2} alignItems="center">
        {enabled ? (
          <Input
            style={{ maxWidth: 100 }}
            disabled={!enabled}
            value={enabled ? inputValue : ""}
            onChange={onInputChange}
          />
        ) : null}

        <Box style={{ width: 100 }} />

        <Switch
          disabled={readOnly}
          isChecked={enabled}
          onChange={readOnly ? null : onEnableChange}
        />
      </Box>
    </>
  );
};

export default ExperimentalInteger;
