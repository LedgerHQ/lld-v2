// @flow
import React, { Component } from "react";
import { ipcRenderer } from "electron";
import type { Store } from "redux";
import "./global.css";

import libcoreGetVersion from "~/commands/libcoreGetVersion";

import type { State as StoreState } from "~/renderer/reducers";

import App from "./App";

type State = {
  error: ?Error,
};

type Props = {
  store: Store<StoreState>,
  language: string,
};

class ReactRoot extends Component<Props, State> {
  state = {
    error: null,
  };

  _timeout: *;

  componentDidMount() {
    ipcRenderer.send("ready-to-show", {});
    // TODO: onAppReady was defined in the old .ejs
    // We need to check out what it was used for
    // window.requestAnimationFrame(() => (this._timeout = setTimeout(() => window.onAppReady(), 300)))
    libcoreGetVersion
      .send()
      .toPromise()
      .then(
        version => {
          console.log("libcoreGetVersion", version);
        },
        e => {
          console.error("libcoreGetVersion", e);
        },
      );
  }

  componentWillUnmount() {
    clearTimeout(this._timeout);
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      error,
    });
  }

  render() {
    const { store, language } = this.props;
    if (this.state.error) {
      return this.state.error.toString();
    }

    return <App store={store} language={language} />;
  }
}

export default ReactRoot;
