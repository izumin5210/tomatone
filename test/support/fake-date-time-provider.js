/* @flow */

export default class FakeDateTimeProvider {
  now: number;

  constructor (now: number = Date.now()) {
    this.now = now
  }

  tick (ms: number) {
    this.now += ms
  }

  nowInMilliSeconds (): number {
    return this.now
  }
}
