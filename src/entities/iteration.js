/* @flow */
import { Record } from "immutable";

const TIMES = {
  WORK:        25 * 60 * 1000,
  SHORT_BREAK: 5 * 60 * 1000,
  LONG_BREAK:  20 * 60 * 1000,
};

type State = $Keys<typeof TIMES>

const MAX_ITERATION = 4;

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type IterationConfig = {
  id:        number;
  startedAt: number;
  state:     State;
  count:     number;
};
/* eslint-enable */

const defaultValues: IterationConfig = {
  id:        1,
  startedAt: Date.now(),
  state:     "WORK",
  count:     1,
};

const IterationRecord = Record(defaultValues);

export default class Iteration extends IterationRecord {

  static createFirst(id: typeof IterationRecord.id): Iteration {
    // FIXME: Should not use `Date.now()`
    const startedAt = Date.now();
    return new Iteration({ id, startedAt });
  }

  totalTimeInMillis(): number {
    return TIMES[this.state];
  }

  remainTimeInMillis(): number {
    // FIXME: Should not use `Date.now()`
    return this.totalTimeInMillis() - (Date.now() - this.startedAt);
  }

  isWorking(): boolean {
    return this.state === "WORK";
  }

  isFinished(): boolean {
    return !(this.remainTimeInMillis() > 0);
  }

  next(): Iteration {
    let state: State = "WORK";
    let count: number = this.count;
    const id = this.id + 1;
    if (this.state === "WORK") {
      const isLongBreak = count % MAX_ITERATION === 0;
      state = isLongBreak ? "LONG_BREAK" : "SHORT_BREAK";
    } else {
      count += 1;
    }
    // FIXME: Should not use `new Date()`
    const startedAt = Date.now();
    return new Iteration({ id, startedAt, state, count });
  }
}
