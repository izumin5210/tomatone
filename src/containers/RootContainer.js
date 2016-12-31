/* @flow */
import React, { Component }  from "react";
import { HashRouter, Match } from "react-router";
import { subscriber }        from "react-dispatcher-decorator";

import {
  State,
} from "../models";

import Reducer from "../reducers";
import App from "./App";

const reducer = new Reducer();

type ContainerState = {
  state: State;
};

const initialState: ContainerState = {
  state: reducer.getState(),
};

@subscriber((self: any, subscribe: any) => {
  reducer.connect(self, subscribe);
})
export default class RootContainer extends Component {

  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  state: ContainerState;

  render() {
    const { state } = this.state;
    return (
      <HashRouter>
        <Match
          pattern="/"
          render={({ location }) => <App {...{ location, state }} />}
        />
      </HashRouter>
    );
  }
}
