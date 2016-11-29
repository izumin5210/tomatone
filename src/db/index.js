import Database from "./database";
import IterationDao from "./dao/iteration-dao";
import TaskDao from "./dao/task-dao";
import { DB_NAME }  from "../settings/constants";

const db = new Database(DB_NAME);
const iterationDao = new IterationDao(db);
const taskDao = new TaskDao(db);

/* eslint-disable import/prefer-default-export */
export {
  db,
  iterationDao,
  taskDao,
};
/* eslint-enable */
