/* @flow */
/* eslint-disable no-multi-spaces */

export const START   = "timer:start";
export const STOP    = "timer:stop";
export const REFRESH = "timer:refresh";
export const RESTART = "timer:restart";

export type RefreshAction = {
  nowInMilliSeconds: number;
};

export type RestartAction = {
  nowInMilliSeconds: number;
};

/* eslint-enable */
