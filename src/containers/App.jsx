import React, { Component } from "react";
import { subscriber }       from "react-dispatcher-decorator";
import { ipcRenderer }      from "electron";

import Timer from "../components/Timer";

@subscriber((self, subscribe) => {
  ipcRenderer.on("render", (sender, state) => {
    self.setState(state);
  });

  ipcRenderer.send("initialize");
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
