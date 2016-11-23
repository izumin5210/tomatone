/* @flow */
import React, { Component } from "react";
import { subscriber }       from "react-dispatcher-decorator";

import Reducer from "../reducers";

import {
  State,
} from "../models";

import PomodoroTimer from "../components/pomodoro_timer/";

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
      <div className={`App${modifier}`}>
        <header className="App__header" />
        <main className="App__main">
          <PomodoroTimer
            timer={state.timer}
            iteration={state.currentIteration()}
          />
        </main>
        <footer className="App__footer" />
      </div>
    );
  }
}
