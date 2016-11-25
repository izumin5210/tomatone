/* @flow */
import { List } from "immutable";

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
        .then((nextState) => {
          assert(nextState.iterations.size, 1);
          assert(nextState.timer.currentIterationId, 1);
        });
    });

    it("returns new state when the state has some iterations", () => {
      const itr1 = new Iteration({ id: 1 });
      const itr2 = new Iteration({ id: 2 });
      const state = new State({
        iterations: List.of(itr1, itr2),
        timer:      new Timer({ currentIterationId: itr2.id }),
      });
      startTimer(state)
        .then((nextState) => {
          assert(nextState.iterations.size, 3);
          assert(nextState.timer.currentIterationId, 3);
        });
    });
  });

  describe("stopTimer()", () => {
    it("returns new state that has stopped timer", () => {
      const itr = new Iteration();
      const state = new State({
        iterations: List.of(itr),
        timer:      new Timer({ currentIterationId: itr.id }),
      });
      stopTimer(state)
        .then((nextState) => {
          assert(nextState.iterations.size, 1);
          assert(nextState.timer.currentIterationId === undefined);
        });
    });
  });
});
