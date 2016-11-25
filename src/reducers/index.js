/* @flow */
import PromisedReducer  from "promised-reducer";

import {
  State,
} from "../models";

import {
  ACTION_TIMER_START,
  ACTION_TIMER_STOP,
} from "../settings/constants";

import {
  startTimer,
  stopTimer,
} from "./timer";

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
  }

  update(fn: (s: ?State) => State | Promise<State>) {
    this.reducer.update(fn);
  }

  getState(): State {
    return this.reducer.state;
  }
}
