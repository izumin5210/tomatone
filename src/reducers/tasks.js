/* @flow */
import { Map } from "immutable";

import {
  State,
} from "../models";

import {
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

export function getAllTasks(state: State): Promise<State> {
  return taskDao.getAll()
    .then(tasks => tasks.reduce(
      (map, task) => map.set(task.id, task),
      Map(),
    ))
    .then(tasks => state.set("tasks", state.tasks.merge(tasks)));
}

export function createTask(state: State, action: CreateAction): Promise<State> {
  return taskDao.create(action.title)
    .then(task => state.set("tasks", state.tasks.set(task.id, task)));
}

export function updateTask(state: State, action: UpdateAction): Promise<State> {
  return taskDao.update(action.task)
    .then(task => state.set("tasks", state.tasks.set(task.id, task)));
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
