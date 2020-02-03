import { createContext } from "react";

const appsListContext = createContext({ setAppInstallDep: () => {}, setAppUninstallDep: () => {} });

export default appsListContext;
