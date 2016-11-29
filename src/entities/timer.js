/* @flow */
import { Record } from "immutable";
import Iteration  from "./iteration";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type TimerConfig = {
  currentIterationId: ?number;
  totalTimeInMillis:  number;
  remainTimeInMillis: number;
}
/* eslint-enable */

const defaultValues: TimerConfig = {
  currentIterationId: undefined,
  totalTimeInMillis:  0,
  remainTimeInMillis: 0,
};

const TimerRecord = Record(defaultValues);

export default class Timer extends TimerRecord {

  hasStarted(): boolean {
    return this.currentIterationId !== undefined;
  }

  updateIteration(itr: Iteration): Timer {
    return this.set("currentIterationId", itr.id)
      .set("totalTimeInMillis", itr.totalTimeInMillis)
      .set("remainTimeInMillis", itr.totalTimeInMillis);
  }

  stop(): Timer {
    return this.set("currentIterationId", undefined)
      .set("totalTimeInMillis", 0)
      .set("remainTimeInMillis", 0);
  }
}
