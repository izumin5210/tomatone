import React, { Component } from "react";
import { subscriber }       from "react-dispatcher-decorator";
import { ipcRenderer }      from "electron";

import {
  ACTION_RENDER,
  ACTION_INITIALIZE,
  ACTION_TIMER_START,
  ACTION_TIMER_STOP,
} from "../settings/constants";

import Timer from "../components/Timer";

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

  render() {
    return (
      <div className="App">
        <header className="App__header" />
        <main className="App__main">
          <Timer
            remainTimeInMillis={1200000}
            totalTimeInMillis={1500000}
          />
        </main>
        <footer className="App__footer" />
      </div>
    );
  }
}
