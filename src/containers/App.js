/* @flow */
import React, { Component }  from "react";
import { subscriber }        from "react-dispatcher-decorator";
import { HashRouter, Match } from "react-router";

import Reducer from "../reducers";

import {
  State,
} from "../models";

import TimerView from "./timer_view";

import {
  GlobalNav,
} from "../components";

const reducer = new Reducer();
// FIXME: apply types
@subscriber((self: any, subscribe: any) => {
  reducer.connect(self, subscribe);
})
export default class App extends Component {

  constructor(props: any) {
    super(props);
    this.state = {
      state: reducer.getState(),
    };
  }

  state: State;

  render() {
    const state = this.state.state;
    const modifier = state.hasStarted() ? `_${state.isWorking() ? "work" : "break"}ing` : "";
    return (
      <HashRouter>
        <div className={`App${modifier}`}>
          <header className="App__header">
            <GlobalNav />
          </header>
          <main className="App__main">
            <Match
              exactly
              pattern="/"
              render={() => <TimerView state={state} />}
            />
          </main>
          <footer className="App__footer" />
        </div>
      </HashRouter>
    );
  }
}
