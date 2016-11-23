/* @flow */

import { List }          from "immutable";
import { useFakeTimers } from "sinon";

import {
  startTimer,
  stopTimer,
} from "../../src/reducers/timer";

import {
  Iteration,
  Timer,
} from "../../src/entities";

import {
  State,
} from "../../src/models";

const now = Date.now("2016-11-22T15:30:00");

describe("timer reducer", () => {
  let clock;

  beforeEach(() => {
    clock = useFakeTimers(now);
  });

  afterEach(() => {
    clock.restore();
  });

  describe("startTimer()", () => {
    it("returns new state when the state has no iterations", () => {
      const state = new State();
      const nextState = startTimer(state);
      assert(nextState.iterations.size, 1);
      assert(nextState.timer.currentIterationId, 1);
    });

    it("returns new state when the state has some iterations", () => {
      const itr1 = new Iteration();
      const itr2 = itr1.next();
      const state = new State({
        iterations: List.of(itr1, itr2),
        timer:      new Timer({ currentIterationId: itr2.id }),
      });
      const nextState = startTimer(state);
      assert(nextState.iterations.size, 3);
      assert(nextState.timer.currentIterationId, 3);
    });
  });

  describe("stopTimer()", () => {
    it("returns new state that has stopped timer", () => {
      const itr = new Iteration();
      const state = new State({
        iterations: List.of(itr),
        timer:      new Timer({ currentIterationId: itr.id }),
      });
      const nextState = stopTimer(state);
      assert(nextState.iterations.size, 1);
      assert(nextState.timer.currentIterationId === undefined);
    });
  });
});
