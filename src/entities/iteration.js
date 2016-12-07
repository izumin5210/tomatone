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
  taskId:            ?number;
};
/* eslint-enable */

const defaultValues: IterationConfig = {
  id:                1,
  startedAt:         0,
  type:              "WORK",
  numOfIteration:    1,
  totalTimeInMillis: TIMES.WORK,
  taskId:            undefined,
};

const IterationRecord = Record(defaultValues);

export default class Iteration extends IterationRecord {

  static MAX_ITERATIONS = MAX_ITERATIONS;
  static TIMES = TIMES;

  remainTimeInMillis(nowInMilliSeconds: number): number {
    return this.totalTimeInMillis - (nowInMilliSeconds - this.startedAt);
  }

  isWorking(): boolean {
    return this.type === "WORK";
  }

  isFinished(nowInMilliSeconds: number): boolean {
    return !(Math.round(this.remainTimeInMillis(nowInMilliSeconds) / 1000) > 0);
  }
}
