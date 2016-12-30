/* @flow */
import { List } from "immutable";

import {
  Category,
  Task,
} from "../../../src/entities";

import {
  db,
  taskDao as dao,
} from "../../../src/db";

describe("TaskDao", () => {
  // TODO: Should move to test-helper
  beforeEach(() => db.delete().then(db.open));
  afterEach(() => db.delete().then(db.close));

  describe("#getAll()", () => {
    it("returns empty list", async () => {
      const tasks = await dao.getAll();
      assert(tasks.size === 0);
    });

    it("returns all saved iterations", async () => {
      await db.tasks.bulkPut([
        { title: "awesome task 1" },
        { title: "awesome task 2" },
        { title: "awesome task 3" },
        { title: "awesome task 4" },
      ]);
      assert(await db.tasks.count() === 4);
      const tasks = await dao.getAll();
      assert(tasks.size === 4);
    });
  });

  describe("#create()", () => {
    it("creates a new task", async () => {
      const task = await dao.create("awesome task");
      assert(task.title === "awesome task");
      assert(task.createdAt != null);
      assert(task.completedAt == null);
      assert(task.order === 0);
      assert(task.categorId == null);
      assert(await db.tasks.count() === 1);
    });

    it("creates a new task that has largest order", async () => {
      await db.tasks.bulkPut([
        { title: "middle task", order: 50 },
        { title: "last task", order: 100 },
        { title: "first task", order: 0 },
      ]);
      const task = await dao.create("new task");
      assert(task.order === 101);
    });

    context("when the category is given", () => {
      let category: Category;

      beforeEach(async () => {
        const id = await db.categories.put({ name: "awesome category" });
        category = new Category(await db.categories.get(id));
      });

      it("creates a new task", async () => {
        const task = await dao.create("awesome task", category);
        assert(task.title === "awesome task");
        assert(task.createdAt != null);
        assert(task.completedAt == null);
        assert(task.categoryId === category.id);
        assert(await db.tasks.count() === 1);
      });
    });
  });

  describe("#update()", () => {
    it("returns an updated task", async () => {
      const id = await db.tasks.put({ title: "awesome task" });
      let task = new Task(await db.tasks.get(id));
      task = await dao.update(task.set("title", "alternative task"));
      assert(task.title === "alternative task");
      assert(await db.tasks.count() === 1);
    });
  });

  describe("#updateAll()", () => {
    it("returns updated tasks", async () => {
      await db.tasks.bulkPut([
        { title: "awesome task 1", order: 0 },
        { title: "awesome task 2", order: 1 },
        { title: "awesome task 3", order: 2 },
        { title: "awesome task 4", order: 3 },
      ]);
      let tasks = (await db.tasks.toArray())
        .map(attrs => new Task(attrs))
        .reduce((l, t) => l.push(t), List());
      tasks = List.of(
        tasks.find(t => t.id === 1).set("order", 1),
        tasks.find(t => t.id === 2).set("order", 2),
        tasks.find(t => t.id === 3).set("order", 0),
      );
      tasks = await dao.updateAll(tasks);
      assert(tasks.find(t => t.id === 1).order === 1);
      assert(tasks.find(t => t.id === 2).order === 2);
      assert(tasks.find(t => t.id === 3).order === 0);
      assert(tasks.find(t => t.id === 4) == null);
    });
  });

  describe("#complete()", () => {
    it("returns completed task", async () => {
      const id = await db.tasks.put({ title: "awesome task" });
      let task = new Task(await db.tasks.get(id));
      task = await dao.complete(task);
      assert(task.completedAt != null);
    });

    it("returns the given task is not changed", async () => {
      const completedAt = Date.now();
      const id = await db.tasks.put({ title: "awesome task", completedAt });
      let task = new Task(await db.tasks.get(id));
      task = await dao.complete(task);
      assert(task.completedAt === completedAt);
    });
  });

  describe("#incomplete()", () => {
    it("returns incompleted task", async () => {
      const id = await db.tasks.put({ title: "awesome task", completedAt: Date.now() });
      let task = new Task(await db.tasks.get(id));
      task = await dao.incomplete(task);
      assert(task.completedAt == null);
    });

    it("returns the given task is not changed", async () => {
      const id = await db.tasks.put({ title: "awesome task" });
      let task = new Task(await db.tasks.get(id));
      task = await dao.incomplete(task);
      assert(task.completedAt == null);
    });
  });

  describe("#delete()", () => {
    it("returns the deleted task", async () => {
      const id = await db.tasks.put({ title: "awesome task" });
      const task = new Task(await db.tasks.get(id));
      await dao.delete(task);
      assert(await db.tasks.count() === 0);
    });

    xit("returns a not found error");
  });
});
