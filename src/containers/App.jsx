import React, { Component } from "react";
import { subscriber }       from "react-dispatcher-decorator";
import { ipcRenderer }      from "electron";

import {
  ACTION_RENDER,
  ACTION_INITIALIZE,
  ACTION_TIMER_START,
  ACTION_TIMER_STOP,
} from "../settings/constants";

import Timer from "../components/timer/";

@subscriber((self, subscribe) => {
  ipcRenderer.on(ACTION_RENDER, (sender, state) => {
    self.setState(state);
  });

  subscribe(ACTION_TIMER_START, (prop) => {
    ipcRenderer.send(ACTION_TIMER_START, prop);
  });

  subscribe(ACTION_TIMER_STOP, (prop) => {
    ipcRenderer.send(ACTION_TIMER_STOP, prop);
  });

  ipcRenderer.send(ACTION_INITIALIZE);
})
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  get timer() {
    return this.state.timer;
  }

  get iterations() {
    return this.state.iterations;
  }

  get hasStarted() {
    return this.state.timer && (this.state.timer.currentIterationId !== undefined);
  }

  get currentIteration() {
    const { timer, iterations } = this.state;
    return iterations.find(v => v.id === timer.currentIterationId);
  }

  get isWorking() {
    return this.hasStarted && this.currentIteration.isWorking;
  }

  render() {
    const modifier = this.hasStarted ? `_${this.isWorking ? "work" : "break"}ing` : "";
    return (
      <div className={`App${modifier}`}>
        <header className="App__header" />
        <main className="App__main">
          { this.timer &&
            <Timer
              timer={this.timer}
              iterations={this.iterations}
            />
          }
        </main>
        <footer className="App__footer" />
      </div>
    );
  }
}
