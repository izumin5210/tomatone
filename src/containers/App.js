/* @flow */
import React, { Component }  from "react";
import { subscriber }        from "react-dispatcher-decorator";
import { HashRouter, Match } from "react-router";

import Reducer from "../reducers";

import {
  SoundPlayer,
  State,
} from "../models";

import TimerView   from "./timer-view";
import TasksView   from "./tasks-view";
import HistoryView from "./history-view";

import {
  GlobalNav,
} from "../components";

import {
  TICKING_SOUND_URI,
  FINISH_SOUND_URI,
} from "../settings/audio";

import {
  ACTION_TIMER_REFRESH,
} from "../settings/constants";

const reducer = new Reducer();

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type AppState = {
  state:              State;
  intervalId:         ?number;
  soundLoaded:        boolean;
  tickingSoundPlayer: SoundPlayer;
  finishSoundPlayer:  SoundPlayer;
}
/* eslint-enable */

const initialState: AppState = {
  state:              reducer.getState(),
  intervalId:         undefined,
  soundLoaded:        false,
  tickingSoundPlayer: new SoundPlayer(TICKING_SOUND_URI),
  finishSoundPlayer:  new SoundPlayer(FINISH_SOUND_URI),
};

// FIXME: apply types
@subscriber((self: any, subscribe: any) => {
  reducer.connect(self, subscribe);
})
export default class App extends Component {

  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  state: AppState;

  componentDidMount() {
    this.checkUpdates(this.state);
    const promise = Promise.all([
      this.state.tickingSoundPlayer.fetch(),
      this.state.finishSoundPlayer.fetch(),
    ]);
    promise.then(() => this.setState({ soundLoaded: true }));
  }

  componentWillUpdate(props: any, state: AppState) {
    this.checkUpdates(state);
  }

  checkUpdates(state: AppState) {
    const itr = state.state.currentIteration();
    if (state.intervalId == null && itr != null) {
      const intervalId = setInterval(() => this.playSound(), 1000);
      this.setState({ intervalId });
    }
  }

  playSound() {
    const itr = this.state.state.currentIteration();
    if (itr != null) {
      if (itr.isWorking()) {
        this.state.tickingSoundPlayer.play();
      }
      if (itr.isFinished()) {
        this.state.finishSoundPlayer.play();
        this.stop();
      }
      this.getChildContext().dispatch(ACTION_TIMER_REFRESH);
    }
  }

  stop() {
    if (this.state.intervalId != null) {
      clearInterval(this.state.intervalId);
      this.setState({ intervalId: undefined });
    }
  }

  render() {
    const state = this.state.state;
    const modifier = `_${state.isWorking() ? "work" : "break"}`;
    return (
      <HashRouter>
        <div className="App">
          <header className={`App__header${modifier}`}>
            <GlobalNav />
          </header>
          <main className="App__main">
            <Match
              exactly
              pattern="/"
              render={() => <TimerView state={state} />}
            />
            <Match
              pattern="/tasks"
              render={() => <TasksView state={state} />}
            />
            <Match
              pattern="/history"
              render={() => <HistoryView state={state} />}
            />
          </main>
          <footer className="App__footer" />
        </div>
      </HashRouter>
    );
  }
}
