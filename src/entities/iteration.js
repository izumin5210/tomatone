/* @flow */
import { Record } from "immutable";

const TIMES = {
  WORK:        25 * 60 * 1000,
  SHORT_BREAK: 5 * 60 * 1000,
  LONG_BREAK:  20 * 60 * 1000,
};

export type IterationType = $Keys<typeof TIMES>;

const MAX_ITERATIONS = 4;

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export type IterationConfig = {
  id:                number;
  startedAt:         number;
  type:              IterationType;
  numOfIteration:    number;
  totalTimeInMillis: number;
};
/* eslint-enable */

const defaultValues: IterationConfig = {
  id:                1,
  startedAt:         Date.now(),
  type:              "WORK",
  numOfIteration:    1,
  totalTimeInMillis: TIMES.WORK,
};

const IterationRecord = Record(defaultValues);

export default class Iteration extends IterationRecord {

  static MAX_ITERATIONS = MAX_ITERATIONS;
  static TIMES = TIMES;

  get remainTimeInMillis(): number {
    // FIXME: Should not use `Date.now()`
    return this.totalTimeInMillis - (Date.now() - this.startedAt);
  }

  isWorking(): boolean {
    return this.type === "WORK";
  }

  isFinished(): boolean {
    return !(Math.round(this.remainTimeInMillis / 1000) > 0);
  }
}
