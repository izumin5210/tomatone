/* @flow */
import React, { Component }  from "react";
import { subscriber }        from "react-dispatcher-decorator";
import { HashRouter, Match } from "react-router";

import Reducer from "../reducers";

import {
  dateTimeProvider,
  SoundPlayer,
  State,
} from "../models";

import TimerView   from "./timer-view";
import TasksView   from "./tasks-view";
import HistoryView from "./history-view";

import {
  GlobalNav,
  MessageToast,
} from "../components";

import {
  TICKING_SOUND_URI,
  FINISH_SOUND_URI,
} from "../settings/audio";

import {
  MessagesActions,
  TimerActions,
} from "../actions";

/* eslint-disable no-duplicate-imports */
import type { DateTimeProvider } from "../models";
/* eslint-enable */

const reducer = new Reducer();

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type AppProps = {
  dateTimeProvider: DateTimeProvider;
};

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

  static defaultProps = {
    dateTimeProvider,
  };

  constructor(props: AppProps) {
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
    this.getChildContext().dispatch(
      TimerActions.RESTART,
      { nowInMilliSeconds: this.nowInMilliSeconds },
    );
  }

  componentWillUpdate(props: any, state: AppState) {
    this.checkUpdates(state);
  }

  get nowInMilliSeconds(): number {
    return this.props.dateTimeProvider.nowInMilliSeconds();
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
      const now = this.props.dateTimeProvider.nowInMilliSeconds();
      if (itr.isFinished(now)) {
        this.state.finishSoundPlayer.play();
        this.stop();
      }
      this.getChildContext().dispatch(
        TimerActions.REFRESH,
        { nowInMilliSeconds: this.nowInMilliSeconds },
      );
    }
  }

  stop() {
    if (this.state.intervalId != null) {
      clearInterval(this.state.intervalId);
      this.setState({ intervalId: undefined });
    }
  }

  dismissMessage() {
    this.getChildContext().dispatch(MessagesActions.REMOVE_MESSAGE);
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
          <MessageToast
            messages={state.messages}
            dismiss={() => this.dismissMessage()}
          />
        </div>
      </HashRouter>
    );
  }
}
