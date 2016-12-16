/* @flow */
import Dexie from "dexie";
import * as schemata20161206113540 from "./20161206113540";
import * as schemata20161216210342 from "./20161216210342";

export default function (db: Dexie) {
  let version = 0;
  db.version((version += 1)).stores(schemata20161206113540);
  db.version((version += 1)).stores(schemata20161216210342);
}
