/* @flow */
import Category from "../../../src/entities/category";

import {
  db,
} from "../../../src/db";

import CategoryDao from "../../../src/db/dao/category-dao";

import { FakeDateTimeProvider }  from "../../support";
import type { DateTimeProvider } from "../../../src/models";

const now = Date.now("2016-12-01T12:34:56");

describe("CategoryDao", () => {
  let dao: CategoryDao;
  let dateTimeProvider: DateTimeProvider;

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

  describe("#create()", () => {
    it("creates a new category", () => (
      dao.create("awesome category")
        .then((category) => {
          assert(category.name === "awesome category");
          assert(category.createdAt === now);
          return Promise.resolve(db.categories.count());
        })
        .then(count => assert(count === 1))
    ));
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
});
