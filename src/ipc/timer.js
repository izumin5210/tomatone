/* @flow */

export const TIMER_STATE = 'ipc:timer:state'

export type TimerState = {
  started: boolean,
  working: boolean,
}
