import { PropTypes }  from "react";
import { Record }     from "immutable";

const defaultValues = {
  id: undefined,
  startedAt: undefined,
  totalTimeInMillis: 0,
  state: undefined,
  count: 0,
  isWorking: true,
};

export default class Iteration extends Record(defaultValues) {

  static WORK = "WORK";
  static SHORT_BREAK = "SHORT_BREAK";
  static LONG_BREAK = "LONG_BREAK";

  static MAX_ITERATION = 4;

  static TIMES = {
    [Iteration.WORK]: 25 * 60 * 1000,
    [Iteration.SHORT_BREAK]: 5 * 60 * 1000,
    [Iteration.LONG_BREAK]: 20 * 60 * 1000,
  }

  static createFirst(id) {
    // FIXME: Should not use `new Date()`
    const startedAt = new Date();
    const state = Iteration.WORK;
    const totalTimeInMillis = Iteration.TIMES[state];
    const count = 1;
    const isWorking = true;
    return new Iteration({ id, startedAt, totalTimeInMillis, state, count, isWorking });
  }

  get remainTimeInMillis() {
    // FIXME: Should not use `new Date()`
    const spentTimeInMillis = new Date() - this.startedAt;
    return this.totalTimeInMillis - spentTimeInMillis;
  }

  get isFinished() {
    return this.remainTimeInMillis < 0;
  }

  get next() {
    let state = Iteration.WORK;
    let count = this.count;
    const id = this.id + 1;
    const isWorking = !this.isWorking;
    if (this.state === Iteration.WORK) {
      const isLongBreak = count % Iteration.MAX_ITERATION === 0;
      state = isLongBreak ? Iteration.LONG_BREAK : Iteration.SHORT_BREAK;
    } else {
      count += 1;
    }
    const totalTimeInMillis = Iteration.TIMES[state];
    // FIXME: Should not use `new Date()`
    const startedAt = new Date();
    return new Iteration({ id, startedAt, totalTimeInMillis, state, count, isWorking });
  }
}

export const IterationType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  startedAt: PropTypes.instanceOf(Date).isRequired,
  totalTimeInMillis: PropTypes.number.isRequired,
  state: PropTypes.oneOf(
    [Iteration.WORK, Iteration.SHORT_BREAK, Iteration.LONG_BREAK],
  ).isRequired,
  count: PropTypes.number.isRequired,
  isWorking: PropTypes.bool.isRequired,
});
