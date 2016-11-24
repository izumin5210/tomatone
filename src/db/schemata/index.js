/* @flow */
import Dexie from "dexie";
import * as schemataV1 from "./v1";

export default function (db: Dexie) {
  db.version(1).stores(schemataV1);
}
