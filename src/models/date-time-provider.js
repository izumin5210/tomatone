/* @flow */
/* eslint-disable import/prefer-default-export */

export interface DateTimeProvider {
  nowInMilliSeconds(): number,
}

export function nowInMilliSeconds (): number {
  return Date.now()
}

/* eslint-disable */
