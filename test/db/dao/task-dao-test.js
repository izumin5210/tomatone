/* @flow */
import Task from "../../../src/entities/task";
import {
  db,
  taskDao as dao,
} from "../../../src/db";

describe("TaskDao", () => {
  // TODO: Should move to test-helper
  beforeEach(() => db.delete().then(db.open));
  afterEach(() => db.delete().then(db.close));

  describe("#getAll()", () => {
    it("returns empty list", () => (
      dao.getAll()
        .then((tasks) => {
          assert(tasks.size === 0);
        })
    ));

    it("returns all saved iterations", () => (
      db.tasks
        .bulkPut([
          { title: "awesome task 1" },
          { title: "awesome task 2" },
          { title: "awesome task 3" },
          { title: "awesome task 4" },
        ])
        .then(() => db.tasks.count())
        .then(count => assert(count === 4))
        .then(() => dao.getAll())
        .then(tasks => assert(tasks.size === 4))
    ));
  });

  describe("#create()", () => {
    it("creates a new task", () => (
      dao.create("awesome task")
        .then((task) => {
          assert(task.title === "awesome task");
          assert(task.createdAt != null);
          assert(task.completedAt == null);
          return Promise.resolve(db.tasks.count());
        })
        .then(count => assert(count === 1))
    ));
  });

  describe("#update()", () => {
    it("returns an updated task", () => (
      db.tasks.put({ title: "awesome task" })
        .then(id => db.tasks.get(id))
        .then(attrs => new Task(attrs))
        .then(task => dao.update(task.set("title", "alternative task")))
        .then(task => assert(task.title === "alternative task"))
        .then(() => db.tasks.count())
        .then(count => assert(count === 1))
    ));
  });

  describe("#complete()", () => {
    it("returns completed task", () => (
      db.tasks.put({ title: "awesome task" })
        .then(id => db.tasks.get(id))
        .then(attrs => new Task(attrs))
        .then(task => dao.complete(task))
        .then((task) => {
          assert(task.completedAt != null);
        })
    ));

    it("returns the given task is not changed", () => {
      const completedAt = Date.now();
      return db.tasks.put({ title: "awesome task", completedAt })
        .then(id => db.tasks.get(id))
        .then(attrs => new Task(attrs))
        .then(task => dao.complete(task))
        .then((task) => {
          assert(task.completedAt === completedAt);
        });
    });
  });

  describe("#incomplete()", () => {
    it("returns incompleted task", () => (
      db.tasks.put({ title: "awesome task", completedAt: Date.now() })
        .then(id => db.tasks.get(id))
        .then(attrs => new Task(attrs))
        .then(task => dao.incomplete(task))
        .then((task) => {
          assert(task.completedAt == null);
        })
    ));

    it("returns the given task is not changed", () => (
      db.tasks.put({ title: "awesome task" })
        .then(id => db.tasks.get(id))
        .then(attrs => new Task(attrs))
        .then(task => dao.incomplete(task))
        .then((task) => {
          assert(task.completedAt == null);
        })
    ));
  });
});
