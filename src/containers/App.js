/* @flow */
import React, { Component } from "react";
import { dispatcher }       from "react-dispatcher-decorator";
import { Match }            from "react-router";

import {
  Category,
} from "../entities";

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
  CategoriesActions,
  MessagesActions,
  TimerActions,
} from "../actions";

/* eslint-disable no-duplicate-imports */
import type { DateTimeProvider } from "../models";
/* eslint-enable */

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type AppProps = {
  state:            State;
  location:         any;
  dateTimeProvider: DateTimeProvider;
};

type AppState = {
  intervalId:         ?number;
  soundLoaded:        boolean;
  tickingSoundPlayer: SoundPlayer;
  finishSoundPlayer:  SoundPlayer;
}
/* eslint-enable */

const initialState: AppState = {
  intervalId:         undefined,
  soundLoaded:        false,
  tickingSoundPlayer: new SoundPlayer(TICKING_SOUND_URI),
  finishSoundPlayer:  new SoundPlayer(FINISH_SOUND_URI),
};

@dispatcher
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
    this.checkUpdates(this.props, this.state);
    this.context.dispatch(TimerActions.INIT);
    // const promise = Promise.all([
    //   this.state.tickingSoundPlayer.fetch(),
    //   this.state.finishSoundPlayer.fetch(),
    // ]);
    // promise.then(() => this.setState({ soundLoaded: true }));
    this.context.dispatch(
      TimerActions.RESTART,
      { nowInMilliSeconds: this.nowInMilliSeconds },
    );
  }

  componentWillUpdate(props: AppProps, state: AppState) {
    this.checkUpdates(props, state);
  }

  componentDidUpdate({ location }: AppProps) {
    const { query } = this.props.location;
    const { categories } = this.props.state;
    if (query !== location.query) {
      let category: Category;
      if (query != null) {
        category = categories.find(({ path }) => path === query.category);
      }
      if (category == null) {
        category = Category.ALL;
      }
      this.context.dispatch(CategoriesActions.SELECT, { category });
    }
  }

  get nowInMilliSeconds(): number {
    return this.props.dateTimeProvider.nowInMilliSeconds();
  }

  async checkUpdates({ state }: AppProps, { intervalId }: AppState) {
    const itr = state.currentIteration();
    if (intervalId == null && itr != null) {
      const newIntervalId = setInterval(async () => await this.playSound(), 1000);
      this.setState({ intervalId: newIntervalId });
    }
  }

  async playSound() {
    const { state } = this.props;
    const { tickingSoundPlayer, finishSoundPlayer } = this.state;
    const itr = state.currentIteration();
    if (itr != null) {
      if (itr.isWorking()) {
        if (!tickingSoundPlayer.isLoaded()) {
          await tickingSoundPlayer.load();
        }
        tickingSoundPlayer.play();
      }
      if (itr.isFinished(this.nowInMilliSeconds)) {
        await finishSoundPlayer.load();
        finishSoundPlayer.play();
        await this.stop();
      }
      this.context.dispatch(
        TimerActions.REFRESH,
        { nowInMilliSeconds: this.nowInMilliSeconds },
      );
    }
  }

  async stop() {
    const { intervalId, tickingSoundPlayer, finishSoundPlayer } = this.state;
    if (intervalId != null) {
      clearInterval(intervalId);
      if (tickingSoundPlayer.isLoaded()) {
        await tickingSoundPlayer.close();
      }
      setTimeout(async () => {
        if (finishSoundPlayer.isLoaded()) {
          await finishSoundPlayer.close();
        }
      }, 3000);
      this.setState({ intervalId: undefined });
    }
  }

  dismissMessage() {
    this.context.dispatch(MessagesActions.REMOVE_MESSAGE);
  }

  render() {
    const { state } = this.props;
    const modifier = `_${state.isWorking() ? "work" : "break"}`;
    return (
      <div className="App">
        <header className={`App__header${modifier}`}>
          <GlobalNav category={state.currentCategory()} />
        </header>
        <main className="App__main">
          <Match
            exactly
            pattern="/"
            render={() => <TimerView {...{ state }} />}
          />
          <Match
            pattern="/tasks"
            render={() => <TasksView {...{ state }} />}
          />
          <Match
            pattern="/history"
            render={() => <HistoryView {...{ state }} />}
          />
        </main>
        <footer className="App__footer" />
        <MessageToast
          messages={state.messages}
          dismiss={() => this.dismissMessage()}
        />
      </div>
    );
  }
}
