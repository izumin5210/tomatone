/* @flow */
import { Record } from "immutable";
import Iteration  from "./iteration";

type TimerConfig = {
  currentIterationId: ?number;
}

const defaultValues: TimerConfig = {
  currentIterationId: undefined,
};

const TimerRecord = Record(defaultValues);

export default class Timer extends TimerRecord {

  hasStarted(): boolean {
    return this.currentIterationId !== undefined;
  }

  updateIteration(itr: Iteration): Timer {
    return this.set("currentIterationId", itr.id);
  }

  stop(): Timer {
    return this.set("currentIterationId", undefined);
  }
}
