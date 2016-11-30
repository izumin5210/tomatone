/* @flow */
import { Map } from "immutable";

import {
  State,
} from "../models";

import {
  taskDao,
} from "../db";

import {
  CreateTaskAction,
  UpdateTaskAction,
  CompleteTaskAction,
  IncompleteTaskAction,
  SelectTaskAction,
} from "../actions/tasks";

export function getAllTasks(state: State): Promise<State> {
  return taskDao.getAll()
    .then(tasks => tasks.reduce(
      (map, task) => map.set(task.id, task),
      Map(),
    ))
    .then(tasks => state.set("tasks", state.tasks.merge(tasks)));
}

export function createTask(state: State, action: CreateTaskAction): Promise<State> {
  return taskDao.create(action.title)
    .then(task => state.set("tasks", state.tasks.set(task.id, task)));
}

export function updateTask(state: State, action: UpdateTaskAction): Promise<State> {
  return taskDao.update(action.task)
    .then(task => state.set("tasks", state.tasks.set(task.id, task)));
}

export function completeTask(state: State, action: CompleteTaskAction): Promise<State> {
  return taskDao.complete(action.task)
    .then((task) => {
      const newState = state.set("tasks", state.tasks.set(task.id, task));
      if (newState.timer.selectedTaskId === task.id) {
        return newState.set("timer", state.timer.updateTask(undefined));
      }
      return newState;
    });
}

export function incompleteTask(state: State, action: IncompleteTaskAction): Promise<State> {
  return taskDao.incomplete(action.task)
    .then(task => state.set("tasks", state.tasks.set(task.id, task)));
}

export function selectTask(state: State, { task }: SelectTaskAction): State {
  return state.set("timer", state.timer.updateTask(task));
}
