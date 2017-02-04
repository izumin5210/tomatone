/* @flow */

export const TIMER_STATE = 'ipc:timer:state'

export type TimerState = {
  started: boolean,
  working: boolean,
}

export const TIMER_OPEN = 'ipc:timer:open'
