// @flow
import { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { hasPasswordSelector, autoLockTimeoutSelector } from "~/renderer/reducers/settings";
import { lock } from "~/renderer/actions/application";

import useInterval from "~/renderer/hooks/useInterval";
import { useDebouncedCallback } from "~/renderer/hooks/useDebounce";

const Idler = () => {
  let timeout;
  const [lastAction, setLastAction] = useState(-1);
  const autoLockTimeout = useSelector(autoLockTimeoutSelector);
  const hasPassword = useSelector(hasPasswordSelector);
  const dispatch = useDispatch();

  const debounceOnChange = useDebouncedCallback(() => setLastAction(Date.now()), 1000, {
    maxWait: 1000,
    leading: true,
  });

  const checkForAutoLock = useCallback(() => {
    if (hasPassword && autoLockTimeout && autoLockTimeout !== -1) {
      if (Date.now() - (lastAction + timeout + 60000) > 0) {
        dispatch(lock());
      }
    }
  }, [autoLockTimeout, dispatch, hasPassword, lastAction, timeout]);

  // onMount & willUnmount
  useEffect(() => {
    window.addEventListener("keydown", debounceOnChange);
    window.addEventListener("mouseover", debounceOnChange);

    return () => {
      window.removeEventListener("keydown", debounceOnChange);
      window.removeEventListener("mouseover", debounceOnChange);
      debounceOnChange.cancel();
    };
  }, [debounceOnChange]);

  useInterval(checkForAutoLock, 10000);

  return null;
};

export default Idler;
