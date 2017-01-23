/* @flow */

export interface DateTimeProvider {
  nowInMilliSeconds(): number,
}

export function nowInMilliSeconds (): number {
  return Date.now()
}
