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

  static createFirst(id: typeof IterationRecord.id): Iteration {
    // FIXME: Should not use `Date.now()`
    const startedAt = Date.now();
    return new Iteration({ id, startedAt });
  }

  static MAX_ITERATIONS = MAX_ITERATIONS;
  static TIMES = TIMES;

  remainTimeInMillis(): number {
    // FIXME: Should not use `Date.now()`
    return this.totalTimeInMillis - (Date.now() - this.startedAt);
  }

  isWorking(): boolean {
    return this.type === "WORK";
  }

  isFinished(): boolean {
    return !(this.remainTimeInMillis() > 0);
  }

  next(): Iteration {
    let type: IterationType = "WORK";
    let numOfIteration : number = this.numOfIteration;
    const id = this.id + 1;
    if (this.type === "WORK") {
      const isLongBreak = numOfIteration % MAX_ITERATION === 0;
      type = isLongBreak ? "LONG_BREAK" : "SHORT_BREAK";
    } else {
      numOfIteration += 1;
    }
    // FIXME: Should not use `new Date()`
    const startedAt = Date.now();
    const totalTimeInMillis = TIMES[type];
    return new Iteration({ id, startedAt, type, numOfIteration, totalTimeInMillis });
  }
}
