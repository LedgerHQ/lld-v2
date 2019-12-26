// @flow
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addDevice, removeDevice, resetDevices } from "~/renderer/actions/devices";
import { command } from "~/renderer/commands";

const ListenDevices = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    let sub;
    let timeout;
    function syncDevices() {
      const devices = {};
      sub = command("listenDevices")().subscribe(
        ({ device, deviceModel, type }) => {
          if (device) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              if (Object.keys(devices).length === 0) {
                sub.unsubscribe();
                syncDevices();
              }
            }, 5000);

            const stateDevice = {
              path: device.path,
              modelId: deviceModel ? deviceModel.id : "nanoS",
              type: "hid",
            };

            if (type === "add") {
              devices[device.path] = true;
              dispatch(addDevice(stateDevice));
            } else if (type === "remove") {
              delete device[device.path];
              dispatch(removeDevice(stateDevice));
            }
          }
        },
        () => {
          clearTimeout(timeout);
          resetDevices();
          syncDevices();
        },
        () => {
          clearTimeout(timeout);
          resetDevices();
          syncDevices();
        },
      );
    }
    syncDevices();

    return () => {
      clearTimeout(timeout);
      sub.unsubscribe();
    };
  }, [dispatch]);

  return null;
};

export default ListenDevices;
