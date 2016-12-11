/* @flow */
import Database from "./database";
import IterationDao from "./dao/iteration-dao";
import TaskDao from "./dao/task-dao";
import { DB_NAME }  from "../settings/constants";

import { dateTimeProvider } from "../models";

const db = new Database(DB_NAME);
const iterationDao = new IterationDao(db, dateTimeProvider);
const taskDao = new TaskDao(db, dateTimeProvider);

/* eslint-disable import/prefer-default-export */
export {
  db,
  iterationDao,
  taskDao,
};
/* eslint-enable */
