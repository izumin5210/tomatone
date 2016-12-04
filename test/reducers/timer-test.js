/* @flow */
import { useFakeTimers }   from "sinon";
import { shouldFulfilled } from "promise-test-helper";

import { Map } from "immutable";

import {
  startTimer,
  stopTimer,
  refreshTimer,
  restartTimer,
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
    it("push an error message when the timer has not a selected task", () => (
      Promise.resolve(db.iterations.put({ totalTimeInMillis: 0 }))
        .then(id => db.iterations.get(id))
        .then(attrs => new Iteration(attrs))
        .then(itr => state.set("iterations", state.iterations.set(itr.id, itr)))
        .then(itr => state.set("timer", state.timer.updateIteration(itr)))
        .then(newState => shouldFulfilled(startTimer(newState)))
        .then(({ iterations, messages }) => {
          assert(messages.size === 1);
          assert(iterations.size === 0);
        })
    ));

    it("push an error message when the timer has not a selected task and the timer has a running iteration", () => (
      shouldFulfilled(startTimer(state))
        .then(({ iterations, messages }) => {
          assert(messages.size === 1);
          assert(messages.get(0).body != null);
          assert(iterations.size === 0);
        })
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
        .then(() => Promise.all([
          db.iterations.get(1).then(attrs => new Iteration(attrs)),
          db.tasks.get(2).then(attrs => new Task(attrs)),
        ]))
        .then(([itr, task]) => (
          state.set("iterations", Map([[itr.id, itr]]))
            .set("timer", state.timer
              .set("currentIterationId", itr.id).set("selectedTaskId", task.id))
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
      const newState = refreshTimer(state);
      if (!(newState instanceof Promise)) {
        assert(newState.timer.totalTimeInMillis === itr.totalTimeInMillis);
        assert(newState.timer.remainTimeInMillis < state.timer.remainTimeInMillis);
      } else {
        assert(!(newState instanceof Promise));
      }
    });

    it("returns new state that started new iteration", () => (
      Promise.resolve(db.iterations.put({ totalTimeInMillis: 0 }))
        .then(() => Promise.all([
          db.iterations.get(1).then(attrs => new Iteration(attrs)),
          db.tasks.get(2).then(attrs => new Task(attrs)),
        ]))
        .then(([itr, task]) => {
          const timer = state.timer
            .set("currentIterationId", itr.id).set("selectedTaskId", task.id);
          return state.set("iterations", Map([[itr.id, itr]])).set("timer", timer);
        })
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
      const newState = refreshTimer(state);
      if (!(newState instanceof Promise)) {
        assert(newState.timer.totalTimeInMillis === 0);
        assert(newState.timer.remainTimeInMillis === 0);
      } else {
        assert(!(newState instanceof Promise));
      }
    });
  });

  describe("#restartTimer()", () => {
    let iteration: Iteration;
    let clock;
    const now = Date.now("2016-12-01T12:34:56");

    beforeEach(() => {
      clock = useFakeTimers(now);
      return Promise.resolve(db.tasks.put({ title: "awesome task" }))
        .then(() => db.iterations.put({ type: "WORK", taskId: 1 }))
        .then(() => db.iterations.get(1))
        .then(attrs => (iteration = new Iteration(attrs)));
    });

    afterEach(() => {
      clock.restore();
    });

    context("when the latest iteration has not finished", () => {
      beforeEach(() => {
        clock.tick(iteration.totalTimeInMillis + 1000);
      });

      xit("returns new state that has restarted tiemr", () => (
        restartTimer(new State())
          .then(({ iterations, timer }) => {
            assert(timer.currentIterationId === iteration.id);
            assert(iterations.size === 1);
          })
      ));
    });

    context("when the latest iteration has not finished", () => {
      xit("returns new state that has not-restarted timer", () => (
        restartTimer(new State())
          .then(({ iterations, timer }) => {
            assert(timer.currentIterationId == null);
            assert(iterations.size === 1);
          })
      ));
    });
  });
});
