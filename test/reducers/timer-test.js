/* @flow */
import { Map } from "immutable";
import { shouldFulfilled, shouldRejected } from "promise-test-helper";

import {
  startTimer,
  stopTimer,
  refreshTimer,
} from "../../src/reducers/timer";

import {
  Iteration,
  Task,
  Timer,
} from "../../src/entities";

import {
  State,
} from "../../src/models";

import {
  db,
} from "../../src/db";

describe("timer reducer", () => {
  let state: State;

  // TODO: Should move to test-helper
  beforeEach(() => db.delete().then(db.open));
  afterEach(() => db.delete().then(db.close));

  beforeEach(() => (
    Promise.resolve(db.tasks.bulkPut([
      { title: "awesome task 1" },
      { title: "awesome task 2" },
      { title: "awesome task 3" },
      { title: "awesome task 4" },
    ]))
      .then(() => db.tasks.toArray())
      .then(arr => arr.map(attrs => new Task(attrs)))
      .then(tasks => tasks.reduce((m, t) => m.set(t.id, t), Map()))
      .then(tasks => (state = new State({ tasks })))
  ));

  describe("startTimer()", () => {
    it("throws an error whent the timer has not a selected task", () => (
      shouldRejected(startTimer(state))
        .catch(e => assert(e instanceof Error))
    ));

    it("returns new state when the state has no iterations", () => {
      state = state.set("timer", state.timer.set("selectedTaskId", state.tasks.get(3).id));
      return shouldFulfilled(startTimer(state))
        .then(({ iterations, timer }) => {
          assert(iterations.size === 1);
          assert(timer.currentIterationId === 1);
          assert(timer.totalTimeInMillis === iterations.get(1).totalTimeInMillis);
          assert(timer.remainTimeInMillis <= iterations.get(1).totalTimeInMillis);
          assert(iterations.get(1).taskId === 3);
        });
    });

    it("returns new state when the state has some iterations", () => (
      Promise.resolve(db.iterations.put({ taskId: state.tasks.get(3).id }))
        .then(() => db.iterations.get(1))
        .then(itr => (
          state.set("iterations", Map([[itr.id, itr]]))
            .set("timer", state.timer.set("currentIterationId", itr.id))
        ))
        .then(newState => shouldFulfilled(startTimer(newState)))
        .then(({ iterations, timer }) => {
          assert(iterations.size === 2);
          assert(timer.currentIterationId === 2);
          assert(timer.totalTimeInMillis === iterations.get(2).totalTimeInMillis);
          assert(timer.remainTimeInMillis <= iterations.get(2).totalTimeInMillis);
        })
    ));
  });

  describe("stopTimer()", () => {
    it("returns new state that has stopped timer", () => {
      const itr = new Iteration();
      state = new State({
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
      state = new State({
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

    it("returns new state that started new iteration", () => (
      Promise.resolve(db.iterations.put({ totalTimeInMillis: 0 }))
        .then(id => db.iterations.get(id))
        .then(attrs => new Iteration(attrs))
        .then(itr => (
          state.set("iterations", Map([[itr.id, itr]]))
            .set("timer", state.timer.set("currentIterationId", itr.id))
        ))
        .then(newState => shouldFulfilled(refreshTimer(newState)))
        .then(({ iterations, timer }) => {
          assert(iterations.size === 2);
          const latestItr = iterations.maxBy(i => i.id);
          assert(timer.currentIterationId === latestItr.id);
          assert(timer.totalTimeInMillis === latestItr.totalTimeInMillis);
          assert(timer.remainTimeInMillis <= latestItr.totalTimeInMillis);
        })
    ));

    it("returns new state that timer has no active iterations", () => {
      const timer = state.timer
        .set("totalTimeInMillis", 60 * 1000)
        .set("remainTimeInMillis", 60 * 1000);
      state = state.set("timer", timer);
      const newState: State = refreshTimer(state);
      assert(newState.timer.totalTimeInMillis === 0);
      assert(newState.timer.remainTimeInMillis === 0);
    });
  });
});
