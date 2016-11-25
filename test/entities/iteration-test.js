/* @flow */
import { useFakeTimers } from "sinon";

import {
  Iteration,
} from "../../src/entities";

const now = Date.now("2016-11-22T15:30:00");

describe("Iteration", () => {
  let clock;

  beforeEach(() => {
    clock = useFakeTimers(now);
  });

  afterEach(() => {
    clock.restore();
  });

  describe("#isWorking()", () => {
    it("returns true when the state is WORK", () => {
      const itr = new Iteration({ type: "WORK" });
      assert(itr.isWorking());
    });

    it("returns true when the state is SHORT_BREAK", () => {
      const itr = new Iteration({ type: "SHORT_BREAK" });
      assert(!itr.isWorking());
    });

    it("returns true when the state is LONG_BREAK", () => {
      const itr = new Iteration({ type: "LONG_BREAK" });
      assert(!itr.isWorking());
    });
  });

  describe("#remainTimeInMillis()", () => {
    it("returns positive value when the iteration has not finished", () => {
      const itr = new Iteration();
      clock.tick(1000);
      assert(itr.remainTimeInMillis(), itr.totalTimeInMillis - 1000);
    });

    it("returns negative value when the iteration has finished", () => {
      const itr = new Iteration();
      clock.tick(itr.totalTimeInMillis + 1000);
      assert(itr.remainTimeInMillis(), -1000);
    });
  });

  describe("#isFinished()", () => {
    it("returns true when the iteration has finished", () => {
      const itr = new Iteration();
      clock.tick(itr.totalTimeInMillis);
      assert(itr.isFinished());
    });

    it("returns true when the iteration has not finished", () => {
      const itr = new Iteration();
      assert(!itr.isFinished());
    });
  });
});
