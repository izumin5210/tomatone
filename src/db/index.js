import Database from "./database";
import IterationDao from "./dao/iteration-dao";
import { DB_NAME }  from "../settings/constants";

const db = new Database(DB_NAME);
const iterationDao = new IterationDao(db);

/* eslint-disable import/prefer-default-export */
export {
  db,
  iterationDao,
};
/* eslint-enable */
