/* @flow */
import PromisedReducer  from "promised-reducer";

import {
  State,
} from "../models";

import {
  ACTION_TIMER_START,
  ACTION_TIMER_STOP,
  ACTION_TIMER_REFRESH,
  ACTION_ITERATIONS_GET,
} from "../settings/constants";

import {
  startTimer,
  stopTimer,
  refreshTimer,
} from "./timer";

import {
  getAllIterations,
} from "./iterations";

const initialState = new State();

export default class Reducer {
  reducer: PromisedReducer;

  constructor() {
    this.reducer = new PromisedReducer(initialState);
  }

  // FIXME: apply types
  connect(self: any, subscribe: any) {
    this.reducer.on(":update", state => self.setState({ state }));

    subscribe(ACTION_TIMER_START, () => this.update(startTimer));
    subscribe(ACTION_TIMER_STOP, () => this.update(stopTimer));
    subscribe(ACTION_TIMER_REFRESH, () => this.update(refreshTimer));
    subscribe(ACTION_ITERATIONS_GET, () => this.update(getAllIterations));
  }

  update(fn: (s: ?State) => State | Promise<State>) {
    this.reducer.update(fn);
  }

  getState(): State {
    return this.reducer.state;
  }
}
