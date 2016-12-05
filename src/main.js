/* @flow */
/* eslint-disable import/no-extraneous-dependencies */
import { app } from "electron";
/* eslint-enable */
import menubar from "menubar";

app.commandLine.appendSwitch("disable-renderer-backgrounding");

const mb = menubar({
  app,
  dir:           __dirname,
  icon:          `${__dirname}/icon.png`,
  preloadWindow: true,
  width:         320,
  height:        480,
  resizable:     false,
  alwaysOnTop:   (process.env.NODE_ENV === "development"),
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
});
