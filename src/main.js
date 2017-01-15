/* @flow */
/* eslint-disable import/no-extraneous-dependencies */
import { app, Menu, ipcMain, powerSaveBlocker } from "electron";
/* eslint-enable */
import menubar         from "menubar";
import openAboutWindow from "about-window";

import { TimerEvents } from "./ipc";

app.commandLine.appendSwitch("disable-renderer-backgrounding");

const iconfile = `icon${process.env.NODE_ENV === "development" ? "-dev" : ""}.png`;

const mb = menubar({
  app,
  dir:           __dirname,
  icon:          `${__dirname}/assets/images/${iconfile}`,
  preloadWindow: true,
  width:         320,
  height:        480,
  resizable:     false,
  alwaysOnTop:   (process.env.NODE_ENV === "development"),
});

let powerSaveBlockerId: ?number;

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

const template = [
  {
    label: "About tomatone",
    click: () => {
      openAboutWindow({
        icon_path:      `${__dirname}/assets/images/icon-large.png`,
        copyright:      "Copyright (c) 2016 Masayuki Izumi",
        bug_report_url: "https://github.com/izumin5210/tomatone/issues",
      });
    },
  },
  {
    type: "separator",
  },
  {
    label:       "Quit tomatone",
    accelerator: "CmdOrCtrl+Q",
    selector:    "terminate:",
  },
];

mb.on("ready", async () => {
  await installExtensions();
  const menu = Menu.buildFromTemplate(template);
  mb.tray.on("right-click", () => {
    mb.tray.popUpContextMenu(menu);
  });
});

ipcMain.on(TimerEvents.TIMER_STATE, (event, { started, working }: TimerEvents.TimerState) => {
  const blockerExisted = (powerSaveBlockerId != null);
  const blockerStarted = blockerExisted && powerSaveBlocker.isStarted(powerSaveBlockerId);
  if (started && working && !blockerExisted) {
    powerSaveBlockerId = powerSaveBlocker.start("prevent-app-suspension");
  } else if (!working && blockerExisted && blockerStarted) {
    powerSaveBlocker.stop(powerSaveBlockerId);
    powerSaveBlockerId = null;
  }
});
