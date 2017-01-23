/* @flow */
import { Map, Range } from 'immutable'
import assert from "power-assert"; // eslint-disable-line

import {
  Category,
  Task,
} from '../entities'

import {
  cleanupCategories,
  State,
} from '../models'

import {
  categoryDao,
  taskDao,
} from '../db'

import type {
  CreateAction,
  UpdateAction,
  CompleteAction,
  IncompleteAction,
  SelectAction,
  DeleteAction,
  UpdateOrderAction,
} from '../actions/tasks'

import {
  parseCategory,
  parseTaskCategory,
} from '../utils'

function findOrCreateCategories (categoryNames: Array<string>): Promise<Array<Category>> {
  return Promise.all(Range(0, categoryNames.length).toArray().map((i) => {
    const name = categoryNames.slice(0, i + 1).join('/')
    return categoryDao.findOrCreateByName(name)
  }))
}

async function cleanupDeletedTaskCategories (state: State, deletedTask: Task): Promise<State> {
  const category = state.categories.get(deletedTask.categoryId)
  if (category == null) {
    return state
  }
  const categoryNames = parseCategory(category.name)
  if (categoryNames.length === 0) {
    return state
  }
  const rootName = categoryNames[0]
  const targetCategories = state.categories.filter(({ name }) => name.startsWith(rootName))
  const deletedCategories = await cleanupCategories(targetCategories, state.tasks, categoryDao)
  const remainCategories = state.categories
    .filterNot(({ id }) => deletedCategories.find(c => c.id === id) != null)
  return state.set('categories', remainCategories)
}

export function getAllTasks (state: State): Promise<State> {
  return taskDao.getAll()
    .then(tasks => tasks.reduce(
      (map, task) => map.set(task.id, task),
      Map(),
    ))
    .then(tasks => state.set('tasks', state.tasks.merge(tasks)))
}

export async function createTask (state: State, { title }: CreateAction): Promise<State> {
  const { categoryNames, taskTitle } = parseTaskCategory(title)
  const categories = await findOrCreateCategories(categoryNames)
  const newState = state.set(
    'categories',
    categories.reduce((map, cat) => map.set(cat.id, cat), state.categories),
  )
  const category = categories[categories.length - 1]
  return taskDao.create(taskTitle, category)
    .then(task => newState.set('tasks', newState.tasks.set(task.id, task)))
}

export async function updateTask (state: State, { task }: UpdateAction): Promise<State> {
  const { categoryNames, taskTitle } = parseTaskCategory(task.title)
  const categories = await findOrCreateCategories(categoryNames)
  let newState = state.set(
    'categories',
    categories.reduce((map, cat) => map.set(cat.id, cat), state.categories),
  )
  const category = categories[categories.length - 1]
  const categoryId = (category == null) ? undefined : category.id
  const targetTask = task.set('title', taskTitle).set('categoryId', categoryId)
  const updatedTask = await taskDao.update(targetTask)
  newState = newState.set('tasks', newState.tasks.set(updatedTask.id, updatedTask))
  return cleanupDeletedTaskCategories(newState, targetTask)
}

export function completeTask (state: State, action: CompleteAction): Promise<State> {
  return taskDao.complete(action.task)
    .then((task) => {
      const newState = state.set('tasks', state.tasks.set(task.id, task))
      if (newState.timer.selectedTaskId === task.id) {
        return newState.set('timer', state.timer.updateTask(undefined))
      }
      return newState
    })
}

export function incompleteTask (state: State, action: IncompleteAction): Promise<State> {
  return taskDao.incomplete(action.task)
    .then(task => state.set('tasks', state.tasks.set(task.id, task)))
}

export function selectTask (state: State, { task }: SelectAction): State {
  return state.set('timer', state.timer.updateTask(task))
}

export async function deleteTask (state: State, action: DeleteAction): Promise<State> {
  const deletedTask = await taskDao.delete(action.task)
  let newState = state.set('tasks', state.tasks.delete(deletedTask.id))
  if (newState.timer.selectedTaskId === deletedTask.id) {
    newState = newState.set('timer', newState.timer.updateTask(null))
  }
  return cleanupDeletedTaskCategories(newState, action.task)
}

export function updateTaskOrder (
  state: State,
  { task, order }: UpdateOrderAction,
): Promise<State> {
  const updatedTasks = state.tasks
    .map((t) => {
      if (t.id === task.id) {
        return t.set('order', order)
      } else if ((order <= t.order && t.order <= task.order)) {
        return t.set('order', t.order + 1)
      } else if ((task.order <= t.order && t.order <= order)) {
        return t.set('order', t.order - 1)
      }
      return t
    })
    .toList()
  return taskDao.updateAll(updatedTasks)
    .then((tasks) => {
      const newTasks = tasks.reduce((m, t) => m.set(t.id, t), state.tasks)
      return state.set('tasks', newTasks)
    })
}
