/* @flow */
import {
  Iteration,
  Timer,
} from "../../src/entities";

describe("Timer", () => {
  describe("#hasStarted()", () => {
    it("returns false when the timer has not a currentIterationId", () => {
      const timer = new Timer();
      assert(!timer.hasStarted());
    });

    it("returns true when the timer has a currentIterationId", () => {
      const timer = new Timer({ currentIterationId: 2 });
      assert(timer.hasStarted());
    });
  });

  describe("#setIteration()", () => {
    it("returns new timer instance that has new iteration id", () => {
      const timer = new Timer({ currentIterationId: 1 });
      const itr = new Iteration({ id: 3 });
      const newTimer = timer.updateIteration(itr);
      assert(newTimer.currentIterationId, itr.id);
    });
  });

  describe("#stop()", () => {
    it("returns new timer instance that has not a currentIterationId", () => {
      const timer = new Timer({ currentIterationId: 1 });
      const newTimer = timer.stop();
      assert(newTimer.currentIterationId === undefined);
    });
  });
});
