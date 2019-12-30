// @flow
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { command } from "~/renderer/commands";
import { getCurrentDevice } from "~/renderer/reducers/devices";

type Props = {
  children?: (?string) => React$Node,
};

type MaybeString = ?string;

const DebugAppInfosForCurrency = ({ children }: Props) => {
  const device = useSelector(getCurrentDevice);
  const [version, setVersion] = useState<MaybeString>(null);
  const unmounted = useRef(false);
  useEffect(() => {
    if (device) {
      command("getAppAndVersion")({ devicePath: device.path })
        .toPromise()
        .then(({ version }) => {
          if (unmounted.current === true) return;
          setVersion(version);
        });
    }

    return () => {
      unmounted.current = true;
    };
  }, []);

  return children ? children(version) : null;
};

export default DebugAppInfosForCurrency;
