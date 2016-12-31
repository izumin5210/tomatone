import "font-awesome/css/font-awesome.css";

import React            from "react";
import { render }       from "react-dom";
import { AppContainer } from "react-hot-loader";

import RootContainer from "./containers/RootContainer";

import "./style.css";

const rootEl = document.getElementById("container");

render(
  <AppContainer>
    <RootContainer />
  </AppContainer>,
  rootEl,
);

if (module.hot) {
  module.hot.accept("./containers/RootContainer", () => {
    const NextApp = require("./containers/RootContainer").default;  // eslint-disable-line
    render(
      <AppContainer>
        <RootContainer />
      </AppContainer>,
      rootEl,
    );
  });
}
