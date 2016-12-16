/* @flow */
import Dexie from "dexie";
import * as schemata20161206113540 from "./20161206113540";

export default function (db: Dexie) {
  let version = 0;
  db.version((version += 1)).stores(schemata20161206113540);
}
