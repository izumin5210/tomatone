/* @flow */
/* eslint-disable import/prefer-default-export */

export const TIMER_STATE = "ipc:timer:state";

export type TimerState = {
  started: boolean;
  working: boolean;
};

/* eslint-enable */
