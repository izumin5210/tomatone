import { ipcMain }      from "electron";
import { Map, List }    from "immutable";
import PromisedReducer  from "promised-reducer";

import {
  Iteration,
  Timer,
} from "../entities";

import {
  ACTION_RENDER,
  ACTION_INITIALIZE,
  ACTION_TIMER_START,
  ACTION_TIMER_STOP,
} from "../settings/constants";

import {
  startTimer,
  stopTimer,
  checkTimer,
} from "./timer";

const initialState = Map({
  timer: new Timer(),
  iterations: List(),
});

export default class Reducer {
  constructor() {
    this.reducer = new PromisedReducer(initialState);
  }

  connect(onUpdate) {
    this.reducer.on(":update", state => onUpdate(state.toJS()));

    ipcMain.on(ACTION_INITIALIZE, () => this.update(state => state));
    ipcMain.on(ACTION_TIMER_START, () => this.update(startTimer));
    ipcMain.on(ACTION_TIMER_STOP, () => this.update(stopTimer));

    this.intervalId = setInterval(() => {
      checkTimer(this.state, this.update.bind(this));
    }, 100);
  }

  disconnect() {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }
  }

  update(fn) {
    this.reducer.update(fn);
  }

  get state() {
    return this.reducer.state;
  }
}
