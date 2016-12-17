/* @flow */
import { Map, Range } from "immutable";

import {
  Category,
} from "../entities";

import {
  State,
} from "../models";

import {
  categoryDao,
  taskDao,
} from "../db";

import type {
  CreateAction,
  UpdateAction,
  CompleteAction,
  IncompleteAction,
  SelectAction,
  DeleteAction,
  UpdateOrderAction,
} from "../actions/tasks";

import {
  parseTaskCategory,
} from "../utils";

function findOrCreateCategories(categoryNames: Array<string>): Promise<Array<Category>> {
  return Promise.all(Range(0, categoryNames.length).toArray().map((i) => {
    const name = categoryNames.slice(0, i + 1).join("/");
    return categoryDao.findOrCreateByName(name);
  }));
}

export function getAllTasks(state: State): Promise<State> {
  return taskDao.getAll()
    .then(tasks => tasks.reduce(
      (map, task) => map.set(task.id, task),
      Map(),
    ))
    .then(tasks => state.set("tasks", state.tasks.merge(tasks)));
}

export async function createTask(state: State, { title }: CreateAction): Promise<State> {
  const { categoryNames, taskTitle } = parseTaskCategory(title);
  const categories = await findOrCreateCategories(categoryNames);
  const newState = state.set(
    "categories",
    categories.reduce((map, cat) => map.set(cat.id, cat), state.categories),
  );
  const category = categories[categories.length - 1];
  return taskDao.create(taskTitle, category)
    .then(task => newState.set("tasks", newState.tasks.set(task.id, task)));
}

export async function updateTask(state: State, { task }: UpdateAction): Promise<State> {
  const { categoryNames, taskTitle } = parseTaskCategory(task.title);
  const categories = await findOrCreateCategories(categoryNames);
  const newState = state.set(
    "categories",
    categories.reduce((map, cat) => map.set(cat.id, cat), state.categories),
  );
  const category = categories[categories.length - 1];
  const categoryId = (category == null) ? undefined : category.id;
  const updatedTask = task.set("title", taskTitle).set("categoryId", categoryId);
  return taskDao.update(updatedTask)
    .then(t => newState.set("tasks", newState.tasks.set(t.id, t)));
}

export function completeTask(state: State, action: CompleteAction): Promise<State> {
  return taskDao.complete(action.task)
    .then((task) => {
      const newState = state.set("tasks", state.tasks.set(task.id, task));
      if (newState.timer.selectedTaskId === task.id) {
        return newState.set("timer", state.timer.updateTask(undefined));
      }
      return newState;
    });
}

export function incompleteTask(state: State, action: IncompleteAction): Promise<State> {
  return taskDao.incomplete(action.task)
    .then(task => state.set("tasks", state.tasks.set(task.id, task)));
}

export function selectTask(state: State, { task }: SelectAction): State {
  return state.set("timer", state.timer.updateTask(task));
}

export function deleteTask(state: State, action: DeleteAction): Promise<State> {
  return taskDao.delete(action.task)
    .then((task) => {
      const newState = state.set("tasks", state.tasks.delete(task.id));
      if (state.timer.selectedTaskId === task.id) {
        return newState.set("timer", newState.timer.updateTask(null));
      }
      return newState;
    });
}

export function updateTaskOrder(
  state: State,
  { task, order }: UpdateOrderAction,
): Promise<State> {
  const updatedTasks = state.tasks
    .map((t) => {
      if (t.id === task.id) {
        return t.set("order", order);
      } else if ((order <= t.order && t.order <= task.order)) {
        return t.set("order", t.order + 1);
      } else if ((task.order <= t.order && t.order <= order)) {
        return t.set("order", t.order - 1);
      }
      return t;
    })
    .toList();
  return taskDao.updateAll(updatedTasks)
    .then((tasks) => {
      const newTasks = tasks.reduce((m, t) => m.set(t.id, t), state.tasks);
      return state.set("tasks", newTasks);
    });
}
