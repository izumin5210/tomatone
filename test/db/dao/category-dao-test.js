/* @flow */
import { List } from "immutable";
import Category from "../../../src/entities/category";

import {
  db,
} from "../../../src/db";

import CategoryDao from "../../../src/db/dao/category-dao";

import { FakeDateTimeProvider }  from "../../support";

const now = Date.now("2016-12-01T12:34:56");

describe("CategoryDao", () => {
  let dao: CategoryDao;
  let dateTimeProvider: FakeDateTimeProvider;

  // TODO: Should move to test-helper
  beforeEach(() => db.delete().then(db.open));
  afterEach(() => db.delete().then(db.close));

  beforeEach(() => {
    dateTimeProvider = new FakeDateTimeProvider(now);
    dao = new CategoryDao(db, dateTimeProvider);
  });

  describe("#getAll()", () => {
    it("returns empty list", () => (
      dao.getAll()
        .then((categories) => {
          assert(categories.size === 0);
        })
    ));

    it("returns all saved iterations", () => (
      db.categories
        .bulkPut([
          { name: "awesome category 1", createdAt: Date.now() },
          { name: "awesome category 2", createdAt: Date.now() },
          { name: "awesome category 3", createdAt: Date.now() },
          { name: "awesome category 4", createdAt: Date.now() },
        ])
        .then(() => db.categories.count())
        .then(count => assert(count === 4))
        .then(() => dao.getAll())
        .then(categories => assert(categories.size === 4))
    ));
  });

  describe("#findOrCreateByName()", () => {
    const name = "awesome category";
    beforeEach(() => (
      Promise.resolve(db.categories.put({ name, createdAt: now }))
        .then(() => dateTimeProvider.tick(10))
    ));

    context("when a category that has the given name has already exists", () => {
      it("returns the existing category", () => (
        dao.findOrCreateByName(name)
          .then((category) => {
            assert(category.id === 1);
            assert(category.name === name);
            assert(category.createdAt === now);
            return Promise.resolve(db.categories.count());
          })
            .then(count => assert(count === 1))
      ));
    });

    context("when a category that has the given name has not exists", () => {
      it("returns a new category", () => (
        dao.findOrCreateByName("alternative category")
          .then((category) => {
            assert(category.id === 2);
            assert(category.name === "alternative category");
            assert(category.createdAt === now + 10);
            return Promise.resolve(db.categories.count());
          })
            .then(count => assert(count === 2))
      ));
    });
  });

  describe("#update()", () => {
    it("returns an updated category", () => (
      db.categories.put({ name: "awesome category" })
        .then(id => db.categories.get(id))
        .then(attrs => new Category(attrs))
        .then(category => category.set("name", "alternative category"))
        .then(category => dao.update(category))
        .then(category => assert(category.name === "alternative category"))
        .then(() => db.categories.count())
        .then(count => assert(count === 1))
    ));
  });

  describe("#delete()", () => {
    it("returns the deleted category", () => (
      db.categories.put({ title: "awesome category" })
        .then(id => db.categories.get(id))
        .then(attrs => new Category(attrs))
        .then(category => dao.delete(category))
        .then(() => db.categories.count())
        .then(c => assert(c === 0))
    ));
  });

  describe("#deleteAll()", () => {
    it("returns deleted categories", async () => {
      await db.categories.bulkPut([
        { name: "c1" },
        { name: "c2" },
        { name: "c1/c3" },
        { name: "c1/c3/c4" },
      ]);
      let categories = (await db.categories.toArray())
        .map(attrs => new Category(attrs));
      categories = List.of(categories[1], categories[3]);
      categories = await dao.deleteAll(categories);
      assert(categories.size === 2);
      assert(categories.find(({ id }) => id === 2) != null);
      assert(categories.find(({ id }) => id === 4) != null);
      assert(await db.categories.get(2) == null);
      assert(await db.categories.get(4) == null);
      assert(await db.categories.count() === 2);
    });
  });
});
