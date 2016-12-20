/* @flow */
import { Map } from "immutable";

import {
  getAllTasks,
  createTask,
  updateTask,
  completeTask,
  incompleteTask,
  selectTask,
  deleteTask,
  updateTaskOrder,
} from "../../src/reducers/tasks";

import {
  Category,
  Task,
} from "../../src/entities";

import {
  State,
} from "../../src/models";

import {
  db,
} from "../../src/db";

describe("tasks reducer", () => {
  let state: State;

  // TODO: Should move to test-helper
  beforeEach(() => db.delete().then(db.open));
  afterEach(() => db.delete().then(db.close));

  beforeEach(() => {
    state = new State({ categories: Map() });
  });

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
      getAllTasks(state)
        .then(({ tasks }) => {
          assert(tasks.size === 4);
        })
    ));

    it("returns new tasks the state has an older one", () => (
      Promise.resolve(db.tasks.get(1))
        .then(task => state.set("tasks", state.tasks.set(task.id, task)))
        .then(newState => (
          Promise.resolve(db.tasks.update(1, { title: "updated task" }))
            .then(() => getAllTasks(newState))
        ))
        .then(({ tasks }) => {
          assert(tasks.size === 4);
          assert(tasks.get(1).title === "updated task");
        })
    ));
  });

  describe("#createTask()", () => {
    context("when the new task has no category", () => {
      it("returns new state that has a created task", () => (
        createTask(state, { title: "awesome task" })
          .then(({ categories, tasks }) => {
            assert(categories.size === 0);
            assert(tasks.size === 1);
            assert(tasks.get(1).title === "awesome task");
            assert(tasks.get(1).categoryId == null);
          })
          .then(() => db.tasks.count())
          .then(count => assert(count === 1))
          .then(() => db.categories.count())
          .then(count => assert(count === 0))
      ));
    });

    context("when the new task has a new category", () => {
      it("returns new state that has a created task", () => (
        createTask(state, { title: "awesome category/awesome task" })
          .then(({ categories, tasks }) => {
            assert(categories.size === 1);
            assert(tasks.size === 1);
            assert(tasks.get(1).title === "awesome task");
            assert(tasks.get(1).categoryId === 1);
            assert(categories.get(1).name === "awesome category");
          })
          .then(() => db.tasks.count())
          .then(count => assert(count === 1))
          .then(() => db.categories.count())
          .then(count => assert(count === 1))
      ));
    });

    context("when the new task has a new nested category", () => {
      it("returns new state that has a created task", () => (
        createTask(state, { title: "awesome category/nested category/awesome task" })
          .then(({ categories, tasks }) => {
            assert(categories.size === 2);
            assert(tasks.size === 1);
            assert(tasks.get(1).title === "awesome task");
            assert(tasks.get(1).categoryId === 2);
            assert(categories.get(1).name === "awesome category");
            assert(categories.get(2).name === "awesome category/nested category");
          })
          .then(() => db.tasks.count())
          .then(count => assert(count === 1))
          .then(() => db.categories.count())
          .then(count => assert(count === 2))
      ));
    });

    context("when the new task has an existing category", () => {
      beforeEach(() => (
        Promise.resolve(db.categories.bulkPut([
          { name: "awesome category" },
          { name: "awesome category/nested category" },
        ]))
          .then(id => Promise.all([
            db.categories.get(id - 1).then(attrs => new Category(attrs)),
            db.categories.get(id).then(attrs => new Category(attrs)),
          ]))
          .then(([cat1, cat2]) => {
            const categories = state.categories
              .set(cat1.id, cat1)
              .set(cat2.id, cat2);
            state = state.set("categories", categories);
          })
      ));

      it("returns new state that has its category", () => (
        createTask(state, { title: "awesome category/alt-nested category/awesome task" })
          .then(({ categories, tasks }) => {
            assert(categories.size === 3);
            assert(tasks.size === 1);
            const task = tasks.get(1);
            assert(task.title === "awesome task");
            assert(task.categoryId === 3);
            assert(categories.get(1).name === "awesome category");
            assert(categories.get(task.categoryId).name === "awesome category/alt-nested category");
          })
          .then(() => db.tasks.count())
          .then(count => assert(count === 1))
          .then(() => db.categories.count())
          .then(count => assert(count === 3))
      ));
    });
  });

  describe("#updateTask()", () => {
    let task: Task;
    let category: Category;

    beforeEach(() => (
      db.categories.bulkPut([
        { name: "awesome category" },
        { name: "awesome category/nested category" },
      ])
        .then(id => Promise.all([
          Promise.resolve(db.categories.get(id - 1)).then(attrs => new Category(attrs)),
          Promise.resolve(db.categories.get(id)).then(attrs => new Category(attrs)),
        ]))
        .then(([cat1, cat2]) => {
          category = cat1;
          const categories = state.categories
            .set(cat1.id, cat1)
            .set(cat2.id, cat2);
          state = state.set("categories", categories);
        })
    ));

    context("when the task has no categories", () => {
      beforeEach(() => (
        Promise.resolve(db.tasks.put({ title: "awesome task" }))
          .then(id => db.tasks.get(id))
          .then(attrs => (task = new Task(attrs)))
          .then(() => (state = state.set("tasks", state.tasks.set(task.id, task))))
      ));

      context("when the updated task has no category", () => {
        it("returns new state that includes the updated task", () => (
          updateTask(state, { task: task.set("title", "updated task") })
            .then(({ tasks }) => {
              assert(tasks.size === 1);
              assert(tasks.get(1).title === "updated task");
              assert(tasks.get(1).categoryId == null);
            })
        ));
      });

      context("when updated task has a new category", () => {
        it("returns new state that includes the updated task", () => (
          updateTask(state, { task: task.set("title", "awesome category/new category/updated task") })
            .then(({ tasks, categories }) => {
              assert(tasks.size === 1);
              assert(categories.size === 3);
              assert(tasks.get(1).title === "updated task");
              assert(tasks.get(1).categoryId === 3);
              assert(categories.get(3).name === "awesome category/new category");
            })
        ));
      });

      context("when updated task has an existing category", () => {
        it("returns new state that includes the updated task", () => (
          updateTask(state, { task: task.set("title", "awesome category/nested category/updated task") })
            .then(({ tasks, categories }) => {
              assert(tasks.size === 1);
              assert(categories.size === 2);
              assert(tasks.get(1).title === "updated task");
              assert(tasks.get(1).categoryId === 2);
              assert(categories.get(2).name === "awesome category/nested category");
            })
        ));
      });
    });

    context("when the task has a category", () => {
      beforeEach(() => (
        Promise.resolve(db.tasks.put({ title: "awesome task", categoryId: category.id }))
          .then(id => db.tasks.get(id))
          .then(attrs => (task = new Task(attrs)))
          .then(() => (state = state.set("tasks", state.tasks.set(task.id, task))))
      ));

      context("when updated task has no category", () => {
        it("returns new state that includes the updated task", () => (
          updateTask(state, { task: task.set("title", "updated task") })
            .then(({ tasks }) => {
              assert(tasks.size === 1);
              assert(tasks.get(1).title === "updated task");
              assert(tasks.get(1).categoryId == null);
            })
        ));
      });

      context("when updated task has the same category as before", () => {
        it("returns new state that includes the updated task", () => (
          updateTask(state, { task: task.set("title", `${category.name}/updated task`) })
            .then(({ tasks }) => {
              assert(tasks.size === 1);
              assert(tasks.get(1).title === "updated task");
              assert(tasks.get(1).categoryId === category.id);
            })
        ));
      });

      context("when updated task has a new category", () => {
        it("returns new state that includes the updated task", () => (
          updateTask(state, { task: task.set("title", "awesome category/new category/updated task") })
            .then(({ tasks, categories }) => {
              assert(tasks.size === 1);
              assert(categories.size === 3);
              assert(tasks.get(1).title === "updated task");
              assert(tasks.get(1).categoryId === 3);
              assert(categories.get(3).name === "awesome category/new category");
            })
        ));
      });

      context("when updated task has an existing category", () => {
        it("returns new state that includes the updated task", () => (
          updateTask(state, { task: task.set("title", "awesome category/nested category/updated task") })
            .then(({ tasks, categories }) => {
              assert(tasks.size === 1);
              assert(categories.size === 2);
              assert(tasks.get(1).title === "updated task");
              assert(tasks.get(1).categoryId === 2);
              assert(categories.get(2).name === "awesome category/nested category");
            })
        ));
      });
    });
  });

  describe("#completeTask()", () => {
    it("returns new state that has the completed task", () => (
      Promise.resolve(db.tasks.put({ title: "awesome task" }))
        .then(id => db.tasks.get(id))
        .then(attrs => new Task(attrs))
        .then((task) => {
          state = state.set("tasks", state.tasks.set(task.id, task));
          return completeTask(state, { task });
        })
        .then(({ tasks }) => {
          assert(tasks.size === 1);
          assert(tasks.get(1).title === "awesome task");
          assert(tasks.get(1).completedAt != null);
        })
    ));

    it("returns new state that is cleared the selected task when the completed task was selected", () => (
      Promise.resolve(db.tasks.put({ title: "awesome task" }))
        .then(id => db.tasks.get(id))
        .then(attrs => new Task(attrs))
        .then((task) => {
          state = state.set("tasks", state.tasks.set(task.id, task));
          state = state.set("timer", state.timer.set("selectedTaskId", task.id));
          return completeTask(state, { task });
        })
        .then(({ tasks, timer }) => {
          assert(tasks.size === 1);
          assert(tasks.get(1).title === "awesome task");
          assert(tasks.get(1).completedAt != null);
          assert(timer.selectedTaskId == null);
        })
    ));
  });

  describe("#incompleteTask()", () => {
    it("returns new state that has the incompleted task", () => (
      Promise.resolve(db.tasks.put({ title: "awesome task", completedAt: Date.now() }))
        .then(id => db.tasks.get(id))
        .then(attrs => new Task(attrs))
        .then((task) => {
          state = state.set("tasks", state.tasks.set(task.id, task));
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
      state = state.set("tasks", state.tasks.set(task1.id, task1).set(task2.id, task2));
      const newState = selectTask(state, { task: task2 });
      assert(newState.timer.selectedTaskId === task2.id);
    });

    it("returns new state that has no selected task", () => {
      const task1 = new Task({ id: 1, title: "awesome task 1" });
      const task2 = new Task({ id: 2, title: "awesome task 2" });
      state = state.set("tasks", state.tasks.set(task1.id, task1).set(task2.id, task2));
      state = state.set("timer", state.timer.set("selectedTaskId", task2.id));
      const newState = selectTask(state, { task: undefined });
      assert(newState.timer.selectedTaskId == null);
    });
  });

  describe("#deleteTask()", () => {
    beforeEach(() => (
      db.tasks.bulkPut([
        { title: "awesome task 1" },
        { title: "awesome task 2" },
      ])
        .then(() => (
          db.tasks.toArray()
            .then(list => list.map(attrs => new Task(attrs)))
            .then((tasks) => {
              state = tasks.reduce(
                (s, t) => s.set("tasks", s.tasks.set(t.id, t)),
                state,
              );
            })
        ))
    ));

    it("returns new state that removed the deleted task", () => {
      state = state.set("timer", state.timer.updateTask(state.tasks.get(1)));
      return deleteTask(state, { task: state.tasks.get(2) })
        .then((newState) => {
          assert(newState.tasks.size === 1);
          assert(newState.timer.selectedTaskId != null);
        })
        .then(() => db.tasks.count())
        .then(c => assert(c === 1));
    });

    it("returns new state that removed the deleted task and clear selected task", () => {
      state = state.set("timer", state.timer.updateTask(state.tasks.get(2)));
      return deleteTask(state, { task: state.tasks.get(2) })
        .then((newState) => {
          assert(newState.tasks.size === 1);
          assert(newState.timer.selectedTaskId == null);
        })
        .then(() => db.tasks.count())
        .then(c => assert(c === 1));
    });
  });

  describe("#updateTaskOrder()", () => {
    beforeEach(() => (
      Promise.resolve(db.tasks.bulkPut([
        { title: "awesome task 1", order: 0 },
        { title: "awesome task 2", order: 1 },
        { title: "awesome task 3", order: 2 },
        { title: "awesome task 4", order: 3 },
        { title: "awesome task 5", order: 4 },
      ]))
        .then(() => db.tasks.count())
        .then(c => assert(c === 5))
        .then(() => db.tasks.toArray())
        .then(list => list.map(attrs => new Task(attrs)))
        .then(tasks => (state = tasks.reduce(
          (s, t) => s.set("tasks", s.tasks.set(t.id, t)),
          state,
        )))
    ));

    context("", () => {
      it("returns new state that has re-ordered tasks", () => (
        updateTaskOrder(state, { task: state.tasks.get(4), order: 1 })
          .then(({ tasks }) => {
            assert(tasks.get(1).order === 0);
            assert(tasks.get(2).order === 2);
            assert(tasks.get(3).order === 3);
            assert(tasks.get(4).order === 1);
            assert(tasks.get(5).order === 4);
          })
      ));
    });

    context("", () => {
      it("returns new state that has re-ordered tasks", () => (
        updateTaskOrder(state, { task: state.tasks.get(2), order: 3 })
          .then(({ tasks }) => {
            assert(tasks.get(1).order === 0);
            assert(tasks.get(2).order === 3);
            assert(tasks.get(3).order === 1);
            assert(tasks.get(4).order === 2);
            assert(tasks.get(5).order === 4);
          })
      ));
    });
  });
});
