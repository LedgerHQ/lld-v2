// @flow

/*
  This file is bundled in to the preload bundle. It get loaded and executed before the renderer bundle.
  Everything set in the window scope will be available for the code that live in the renderer bundle.
  Node API can be reached by the renderer bundle through a proxy define here, even if its nodeIntegration flag is off.

  /!\ Everything done in this file must be safe, it can not afford to crash. /!\
*/

import React from "react";
import { render } from "react-dom";
import styled, { keyframes } from "styled-components";
import { ipcRenderer } from "electron";
import logo from "./logo.svg";
import palettes from "~/renderer/styles/palettes";

const loadedAnim = keyframes`
  0% {
    transform: translateZ(1);
  }
  100% {
    transform: translateZ(2000px);
  }
`;

const logoAnim = keyframes`
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(-360deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(-1080deg);
  }
`;

const appLoaded = () => {
  setTimeout(() => {
    const rendererNode = document.getElementById("react-root");
    const loaderContainer = document.getElementById("loader-container");
    const loader = document.getElementById("loader");

    if (rendererNode && loaderContainer && loader) {
      rendererNode.style.visibility = "visible";
      requestAnimationFrame(() => {
        loader.classList.add("loaded");
        loaderContainer.classList.add("loaded");

        setTimeout(() => {
          if (loaderContainer.parentNode) {
            loaderContainer.parentNode.removeChild(loaderContainer);
          }
        }, 1000);
      });
    }
  }, 2000);
};

window.api = {
  appLoaded,
};

const LoaderContainer = styled.div`
  z-index: 99;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-perspective: 2000px;
  background-color: ${p => p.palette.background.default};
  transition: opacity 0.8s ease-out;
  opacity: 1;

  &.loaded {
    opacity: 0;
    pointer-events: none;
  }
`;

const LogoContainer = styled.div`
  width: 70px;
  height: 70px;
  background-color: white;
  border-radius: 50%;
  padding: 8px;
  box-sizing: content-box;

  &.loaded {
    animation: ${loadedAnim} 0.7s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
  }
`;

const Image = styled.img`
  animation: ${logoAnim} 1.8s infinite;
  height: 100%;
  width: 100%;
`;

const Loader = ({ palette }: { palette: any }) => {
  return (
    <LoaderContainer palette={palette} id="loader-container">
      <LogoContainer id="loader">
        <Image src={logo} />
      </LogoContainer>
    </LoaderContainer>
  );
};

const init = async () => {
  const settings = await ipcRenderer.invoke("getKey", {
    ns: "app",
    keyPath: "settings",
    defaultValue: {},
  });

  window.settings = settings;

  const osTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const palette = palettes[settings.theme || osTheme];

  window.onload = () => {
    const loaderNode = document.getElementById("preload-root");
    if (loaderNode) {
      render(<Loader palette={palette} />, loaderNode);
    }
    ipcRenderer.send("ready-to-show", {});
  };
};

init();
