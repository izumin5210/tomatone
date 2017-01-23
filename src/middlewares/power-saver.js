/* @flow */
import { ipcRenderer } from 'electron'

import { State }       from '../models'
import { TimerEvents } from '../ipc'

type StateOrPromise = State | Promise<State>

export default function powerSaver (stateOrPromise: StateOrPromise): StateOrPromise {
  return Promise.resolve(stateOrPromise)
    .then((state) => {
      const payload: TimerEvents.TimerState = {
        started: state.hasStarted(),
        working: state.isWorking(),
      }
      ipcRenderer.send(TimerEvents.TIMER_STATE, payload)
      return state
    })
}
