/* @flow */
import { Map } from "immutable";

import {
  getAllTasks,
  createTask,
  updateTask,
  completeTask,
  incompleteTask,
  selectTask,
} from "../../src/reducers/tasks";

import {
  Task,
  Timer,
} from "../../src/entities";

import {
  State,
} from "../../src/models";

import {
  db,
} from "../../src/db";

describe("tasks reducer", () => {
  // TODO: Should move to test-helper
  beforeEach(() => db.delete().then(db.open));
  afterEach(() => db.delete().then(db.close));

  describe("#getAllTasks()", () => {
    beforeEach(() => {
      const promise = db.tasks.bulkPut([
        { title: "awesome task 1" },
        { title: "awesome task 2" },
        { title: "awesome task 3" },
        { title: "awesome task 4" },
      ])
        .then(() => db.tasks.count())
        .then(c => assert(c === 4));
      return Promise.resolve(promise);
    });

    it("returns all iterations stored on IndexdDB", () => (
      getAllTasks(new State())
        .then(({ tasks }) => {
          assert(tasks.size === 4);
        })
    ));

    it("returns new tasks the state has an older one", () => (
      Promise.resolve(db.tasks.get(1))
        .then(task => new State({
          task: Map([[task.id, task]]),
        }))
        .then(state => (
          Promise.resolve(db.tasks.update(1, { title: "updated task" }))
            .then(() => getAllTasks(state))
        ))
        .then(({ tasks }) => {
          assert(tasks.size === 4);
          assert(tasks.get(1).title === "updated task");
        })
    ));
  });

  describe("#createTask()", () => {
    it("returns new state that has a created task", () => (
      createTask(new State(), { title: "awesome task" })
        .then(({ tasks }) => {
          assert(tasks.size === 1);
          assert(tasks.get(1).title === "awesome task");
        })
    ));
  });

  describe("#updateTask()", () => {
    it("returns new state that has the updated task", () => (
      Promise.resolve(db.tasks.put({ title: "awesome task" }))
        .then(id => db.tasks.get(id))
        .then(attrs => new Task(attrs))
        .then((task) => {
          const state = new State({
            tasks: Map([[task.id, task]]),
          });
          return updateTask(state, { task: task.set("title", "updated task") });
        })
        .then(({ tasks }) => {
          assert(tasks.size === 1);
          assert(tasks.get(1).title === "updated task");
          assert(tasks.get(1).completedAt == null);
        })
    ));
  });

  describe("#completeTask()", () => {
    it("returns new state that has the completed task", () => (
      Promise.resolve(db.tasks.put({ title: "awesome task" }))
        .then(id => db.tasks.get(id))
        .then(attrs => new Task(attrs))
        .then((task) => {
          const state = new State({
            tasks: Map([[task.id, task]]),
          });
          return completeTask(state, { task });
        })
        .then(({ tasks }) => {
          assert(tasks.size === 1);
          assert(tasks.get(1).title === "awesome task");
          assert(tasks.get(1).completedAt != null);
        })
    ));
  });

  describe("#incompleteTask()", () => {
    it("returns new state that has the incompleted task", () => (
      Promise.resolve(db.tasks.put({ title: "awesome task", completedAt: Date.now() }))
        .then(id => db.tasks.get(id))
        .then(attrs => new Task(attrs))
        .then((task) => {
          const state = new State({
            tasks: Map([[task.id, task]]),
          });
          return incompleteTask(state, { task });
        })
        .then(({ tasks }) => {
          assert(tasks.size === 1);
          assert(tasks.get(1).title === "awesome task");
          assert(tasks.get(1).completedAt == null);
        })
    ));
  });

  describe("#selectTask()", () => {
    it("returns new state that has the selected task", () => {
      const task1 = new Task({ id: 1, title: "awesome task 1" });
      const task2 = new Task({ id: 2, title: "awesome task 2" });
      const state = new State({
        tasks: Map([[task1.id, task1], [task2.id, task2]]),
      });
      const newState = selectTask(state, { task: task2 });
      assert(newState.timer.selectedTaskId === task2.id);
    });

    it("returns new state that has no selected task", () => {
      const task1 = new Task({ id: 1, title: "awesome task 1" });
      const task2 = new Task({ id: 2, title: "awesome task 2" });
      const state = new State({
        tasks: Map([[task1.id, task1], [task2.id, task2]]),
        timer: new Timer({ selectedTaskId: task2.id }),
      });
      const newState = selectTask(state, { task: undefined });
      assert(newState.timer.selectedTaskId == null);
    });
  });
});
