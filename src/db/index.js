/* @flow */
import Database from './database'
import CategoryDao from './dao/category-dao'
import IterationDao from './dao/iteration-dao'
import TaskDao from './dao/task-dao'
import { DB_NAME }  from '../settings/constants'

import { dateTimeProvider } from '../models'

const db = new Database(DB_NAME)
const categoryDao = new CategoryDao(db, dateTimeProvider)
const iterationDao = new IterationDao(db, dateTimeProvider)
const taskDao = new TaskDao(db, dateTimeProvider)

export {
  db,
  categoryDao,
  iterationDao,
  taskDao,
  CategoryDao,
  IterationDao,
  TaskDao,
}
