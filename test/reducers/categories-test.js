/* @flow */
import { Map } from "immutable";

import {
  getAllCategories,
  deleteUnusedCategories,
} from "../../src/reducers/categories";

import {
  State,
} from "../../src/models";

import {
  Category,
  Task,
} from "../../src/entities";

import {
  db,
} from "../../src/db";

describe("categories reducer", () => {
  let state: State;

  // TODO: Should move to test-helper
  beforeEach(() => db.delete().then(db.open));
  afterEach(() => db.delete().then(db.close));

  beforeEach(() => {
    state = new State({ categories: Map() });
  });

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
        getAllCategories(state)
          .then(({ categories }) => {
            assert(categories.size === 4);
          })
      ));
    });

    context("when the state has an old category", () => {
      beforeEach(() => (
        Promise.resolve(db.categories.get(1))
          .then((category) => {
            state = state.set("categories", state.categories.set(category.id, category));
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

  describe("#deleteUnusedCategories()", () => {
    const createState = async (
      categoryAttrsList: Array<{ name: string }>,
      taskAttrsList: Array<{ title: string, categoryId: number }>,
    ) => {
      await db.categories.bulkPut(categoryAttrsList);
      await db.tasks.bulkPut(taskAttrsList);
      const categories = (await db.categories.toArray())
        .map(attrs => new Category(attrs))
        .reduce((m, c) => m.set(c.id, c), Map());
      const tasks = (await db.tasks.toArray())
        .map(attrs => new Task(attrs))
        .reduce((m, t) => m.set(t.id, t), Map());
      state = new State({ categories, tasks });

      assert(await db.categories.count() === categoryAttrsList.length);
      assert(await db.tasks.count() === taskAttrsList.length);

      return state;
    };

    beforeEach(async () => {
      state = await createState(
        [
          { name: "c1" },
          { name: "c2" },
          { name: "c1/c3" },
          { name: "c1/c4" },
          { name: "c1/c3/c5" }, // id: 5
          { name: "c1/c3/c6" },
          { name: "c1/c7" },    // id: 7
          { name: "c1/c7/c8" },
          { name: "c2/c9" },
          { name: "c2/c9/c10" },
        ],
        [
          { title: "t1", categoryId: 5 },
          { title: "t2", categoryId: 7 },
        ],
      );
      state = await deleteUnusedCategories(state);
    });

    it("remains 5 categories", async () => {
      assert(state.categories.size === 4);
      assert((await db.categories.count()) === 4);
    });

    it("removes leaf categories that has no tasks", async () => {
      assert(!state.categories.has(4));
      assert(await db.categories.get(4) == null);
      assert(!state.categories.has(6));
      assert(await db.categories.get(6) == null);
    });

    it("remains leaf categories that has any tasks", async () => {
      assert(state.categories.has(5));
      assert((await db.categories.get(5)).name === "c1/c3/c5");
    });

    it("stop removing recursively when a middle node has any tasks", async () => {
      assert(!state.categories.has(8));
      assert(await db.categories.get(8) == null);
      assert(state.categories.has(7));
      assert((await db.categories.get(7)).name === "c1/c7");
    });

    it("removes an empty tree recursively", async () => {
      assert(!state.categories.has(2));
      assert(await db.categories.get(2) == null);
      assert(!state.categories.has(9));
      assert(await db.categories.get(9) == null);
      assert(!state.categories.has(10));
      assert(await db.categories.get(10) == null);
    });
  });
});
