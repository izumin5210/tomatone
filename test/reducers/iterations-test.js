/* @flow */
import { Map } from "immutable";

import {
  getAllIterations,
} from "../../src/reducers/iterations";

import {
  State,
} from "../../src/models";

import {
  db,
} from "../../src/db";

describe("iterations reducer", () => {
  // TODO: Should move to test-helper
  beforeEach(() => db.delete().then(db.open));
  afterEach(() => db.delete().then(db.close));

  describe("#getAllIterations()", () => {
    beforeEach(() => {
      let i = 1;
      const promise = db.iterations.bulkPut([
        { type: "WORK", numOfIteration: i },
        { type: "SHORT_BREAK", numOfIteration: (i += 1) },
        { type: "WORK", numOfIteration: i },
        { type: "SHORT_BREAK", numOfIteration: (i += 1) },
        { type: "WORK", numOfIteration: i },
        { type: "SHORT_BREAK", numOfIteration: (i += 1) },
        { type: "WORK", numOfIteration: i },
        { type: "LONG_BREAK", numOfIteration: (i += 1) },
      ])
        .then(() => db.iterations.count())
        .then(count => assert(count === 8));
      return Promise.resolve(promise);
    });

    it("returns all iterations stored on IndexedBD", () => {
      const state = new State();
      return getAllIterations(state)
        .then((nextState) => {
          assert(nextState.iterations.size === 8);
        });
    });

    it("returns new iterations when the state has an older one", () => (
      Promise.resolve(db.iterations.get(1))
        .then(itr => new State({
          iterations: Map([[itr.id, itr]]),
        }))
        .then(state => (
          Promise.resolve(db.iterations.update(1, { totalTimeInMillis: 3 * 60 * 1000 }))
            .then(() => getAllIterations(state))
        ))
        .then((state) => {
          assert(state.iterations.size === 8);
          assert(state.iterations.get(1).totalTimeInMillis != null);
        })
    ));
  });
});
