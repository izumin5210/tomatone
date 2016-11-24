import Database from "./database";
import { DB_NAME }  from "../settings/constants";

const db = new Database(DB_NAME);

/* eslint-disable import/prefer-default-export */
export {
  db,
};
/* eslint-enable */
