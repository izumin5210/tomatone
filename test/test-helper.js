/* @flow */
import React       from "react";
import assert      from "power-assert";
import indexedDB   from "fake-indexeddb";
import IDBKeyRange from "fake-indexeddb/lib/FDBKeyRange";
import { jsdom }   from "jsdom";

global.React = React;
global.assert = assert;

global.document = jsdom("");
global.window = document.defaultView;
global.indexedDB = global.window.indexedDB = indexedDB;
global.IDBKeyRange = global.window.IDBKeyRange = IDBKeyRange;

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === "undefined") {
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: "node.js",
};
