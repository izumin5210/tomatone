import React      from "react";
import assert     from "power-assert";
import { jsdom }  from "jsdom";

global.React = React;
global.assert = assert;

global.document = jsdom("");
global.window = document.defaultView;

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === "undefined") {
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: "node.js",
};
