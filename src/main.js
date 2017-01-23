/* @flow */
import { app, Menu, ipcMain, powerSaveBlocker } from 'electron'
import menubar from 'menubar'

import { TimerEvents } from './ipc'

app.commandLine.appendSwitch('disable-renderer-backgrounding')

const iconfile = `icon${process.env.NODE_ENV === 'development' ? '-dev' : ''}.png`

const mb = menubar({
  app,
  dir:           __dirname,
  icon:          `${__dirname}/assets/images/${iconfile}`,
  preloadWindow: true,
  width:         320,
  height:        480,
  resizable:     false,
  alwaysOnTop:   (process.env.NODE_ENV === 'development'),
})

const menuTemplate = [
  {
    label:   'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
      { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
    ],
  },
]

let powerSaveBlockerId: ?number

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require("source-map-support"); // eslint-disable-line
  sourceMapSupport.install()
}

if (process.env.NODE_ENV === 'development') {
  require("electron-debug")(); // eslint-disable-line
}

const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require("electron-devtools-installer"); // eslint-disable-line
    const extensions = [
      'REACT_DEVELOPER_TOOLS',
    ]
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    extensions.forEach(async (name) => {
      try {
        await installer.default(installer[name], forceDownload)
      } catch (e) {} // eslint-disable-line
    })
  }
}

mb.on('ready', async () => {
  await installExtensions()
  Menu.setApplicationMenu(Menu.buildFromTempalte(menuTemplate))
})

ipcMain.on(TimerEvents.TIMER_STATE, (event, { started, working }: TimerEvents.TimerState) => {
  const blockerExisted = (powerSaveBlockerId != null)
  const blockerStarted = blockerExisted && powerSaveBlocker.isStarted(powerSaveBlockerId)
  if (started && working && !blockerExisted) {
    powerSaveBlockerId = powerSaveBlocker.start('prevent-app-suspension')
  } else if (!working && blockerExisted && blockerStarted) {
    powerSaveBlocker.stop(powerSaveBlockerId)
    powerSaveBlockerId = null
  }
})
