/* @flow */
import { Record, List } from "immutable";

import {
  Iteration,
  Timer,
} from "../entities";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type StateConfig = {
  iterations: List<Iteration>;
  timer:      Timer;
};
/* eslint-enable */

const defaultValues: StateConfig = {
  iterations: List(),
  timer:      new Timer(),
};

const StateRecord = Record(defaultValues);

export default class State extends StateRecord {
  currentIteration(): ?Iteration {
    return this.iterations.find(v => v.id === this.timer.currentIterationId);
  }

  hasStarted(): boolean {
    return this.timer.hasStarted();
  }

  isWorking(): boolean {
    const itr = this.currentIteration();
    return (itr === undefined || itr === null) ? false : itr.isWorking();
  }
}
