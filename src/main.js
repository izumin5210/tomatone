import menubar from "menubar";

import { ACTION_RENDER } from "./settings/constants";
import Reducer from "./reducers";

let reducer;

const mb = menubar({
  dir: __dirname,
  preloadWindow: true,
  width: 320,
  height: 480,
  resizable: false,
});

if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require("source-map-support"); // eslint-disable-line
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === "development") {
  require("electron-debug")(); // eslint-disable-line
}

const installExtensions = async () => {
  if (process.env.NODE_ENV === "development") {
    const installer = require("electron-devtools-installer"); // eslint-disable-line
    const extensions = [
      "REACT_DEVELOPER_TOOLS",
    ];
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    extensions.forEach(async (name) => {
      try {
        await installer.default(installer[name], forceDownload);
      } catch (e) {} // eslint-disable-line
    });
  }
};

mb.on("ready", async () => {
  await installExtensions();
  // createWindow();

  reducer = new Reducer();
  reducer.connect((state) => {
    mb.window.webContents.send(ACTION_RENDER, state);
  });
});

mb.on("after-close", () => {
  reducer.disconnect();
});
