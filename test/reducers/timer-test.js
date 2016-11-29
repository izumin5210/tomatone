/* @flow */
import { Map } from "immutable";

import {
  startTimer,
  stopTimer,
  refreshTimer,
} from "../../src/reducers/timer";

import {
  Iteration,
  Timer,
} from "../../src/entities";

import {
  State,
} from "../../src/models";

import {
  db,
} from "../../src/db";

describe("timer reducer", () => {
  // TODO: Should move to test-helper
  beforeEach(db.open);
  afterEach(db.close);

  describe("startTimer()", () => {
    it("returns new state when the state has no iterations", () => {
      const state = new State();
      return startTimer(state)
        .then(({ iterations, timer }) => {
          assert(iterations.size === 1);
          assert(timer.currentIterationId === 1);
          assert(timer.totalTimeInMillis === iterations.get(1).totalTimeInMillis);
          assert(timer.remainTimeInMillis <= iterations.get(1).totalTimeInMillis);
        });
    });

    it("returns new state when the state has some iterations", () => {
      const itr1 = new Iteration({ id: 1 });
      const state = new State({
        iterations: Map([[itr1.id, itr1]]),
        timer:      new Timer({ currentIterationId: itr1.id }),
      });
      return startTimer(state)
        .then(({ iterations, timer }) => {
          assert(iterations.size === 2);
          assert(timer.currentIterationId === 2);
          assert(timer.totalTimeInMillis === iterations.get(2).totalTimeInMillis);
          assert(timer.remainTimeInMillis <= iterations.get(2).totalTimeInMillis);
        });
    });
  });

  describe("stopTimer()", () => {
    it("returns new state that has stopped timer", () => {
      const itr = new Iteration();
      const state = new State({
        iterations: Map([[itr.id, itr]]),
        timer:      new Timer({ currentIterationId: itr.id }),
      });
      return stopTimer(state)
        .then(({ iterations, timer }) => {
          assert(iterations.size === 1);
          assert(timer.currentIterationId === undefined);
          assert(timer.totalTimeInMillis === 0);
          assert(timer.remainTimeInMillis === 0);
        });
    });
  });

  describe("refreshTimer()", () => {
    it("returns new state that timer's times are refreshed", () => {
      const itr = new Iteration();
      const state = new State({
        iterations: Map([[itr.id, itr]]),
        timer:      new Timer({
          currentIterationId: itr.id,
          totalTimeInMillis:  itr.totalTimeInMillis,
          remainTimeInMillis: itr.remainTimeInMillis + 10,
        }),
      });
      const newState: State = refreshTimer(state);
      assert(newState.timer.totalTimeInMillis === itr.totalTimeInMillis);
      assert(newState.timer.remainTimeInMillis < state.timer.remainTimeInMillis);
    });

    it("returns new state that started new iteration", () => {
      const itr = new Iteration({ totalTimeInMillis: 0 });
      const state = new State({
        iterations: Map([[itr.id, itr]]),
        timer:      new Timer({ currentIterationId: itr.id }),
      });
      return refreshTimer(state)
        .then(({ iterations, timer }) => {
          assert(iterations.size === 2);
          const latestItr = iterations.maxBy(i => i.id);
          assert(timer.currentIterationId === latestItr.id);
          assert(timer.totalTimeInMillis === latestItr.totalTimeInMillis);
          assert(timer.remainTimeInMillis <= latestItr.totalTimeInMillis);
        });
    });

    it("returns new state that timer has no active iterations", () => {
      const state = new State({
        iterations: Map(),
        timer:      new Timer({
          totalTimeInMillis:  60 * 1000,
          remainTimeInMillis: 60 * 1000,
        }),
      });
      const newState: State = refreshTimer(state);
      assert(newState.timer.totalTimeInMillis === 0);
      assert(newState.timer.remainTimeInMillis === 0);
    });
  });
});
