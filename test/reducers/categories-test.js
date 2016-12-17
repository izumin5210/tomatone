/* @flow */
import { Map } from "immutable";

import {
  getAllCategories,
} from "../../src/reducers/categories";

import {
  State,
} from "../../src/models";

import {
  db,
} from "../../src/db";

describe("categories reducer", () => {
  // TODO: Should move to test-helper
  beforeEach(() => db.delete().then(db.open));
  afterEach(() => db.delete().then(db.close));

  describe("#getAllCategories()", () => {
    beforeEach(() => {
      const promise = db.categories.bulkPut([
        { name: "awesome category 1" },
        { name: "awesome category 2" },
        { name: "awesome category 3" },
        { name: "awesome category 4" },
      ])
        .then(() => db.categories.count())
        .then(c => assert(c === 4));
      return Promise.resolve(promise);
    });

    context("when the state has no categories", () => {
      it("returns the new state that has all categories stored on IndexdDB", () => (
        getAllCategories(new State())
          .then(({ categories }) => {
            assert(categories.size === 4);
          })
      ));
    });

    context("when the state has an old category", () => {
      let state: State;
      beforeEach(() => (
        Promise.resolve(db.categories.get(1))
          .then((category) => {
            state = new State({
              category: Map([[category.id, category]]),
            });
          })
          .then(() => db.categories.update(1, { name: "updated category" }))
      ));

      it("returns new state the has all categories including the updated category", () => (
        getAllCategories(state)
          .then(({ categories }) => {
            assert(categories.size === 4);
            assert(categories.get(1).name === "updated category");
          })
      ));
    });
  });
});
