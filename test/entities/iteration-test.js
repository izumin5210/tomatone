/* @flow */
import Iteration from 'entities/iteration'

const startedAt = Date.now('2016-11-22T15:30:00')

describe('Iteration', () => {
  let itr: Iteration

  beforeEach(() => {
    itr = new Iteration({ startedAt })
  })

  describe('#isWorking()', () => {
    it('returns true when the state is WORK', () => {
      itr = itr.set('type', 'WORK')
      assert(itr.isWorking())
    })

    it('returns true when the state is SHORT_BREAK', () => {
      itr = itr.set('type', 'SHORT_BREAK')
      assert(!itr.isWorking())
    })

    it('returns true when the state is LONG_BREAK', () => {
      itr = itr.set('type', 'LONG_BREAK')
      assert(!itr.isWorking())
    })
  })

  describe('#remainTimeInMillis()', () => {
    it('returns positive value when the iteration has not finished', () => {
      const now = startedAt + 1000
      assert(itr.remainTimeInMillis(now), itr.totalTimeInMillis - 1000)
    })

    it('returns negative value when the iteration has finished', () => {
      const now = startedAt + itr.totalTimeInMillis + 1000
      assert(itr.remainTimeInMillis(now), -1000)
    })
  })

  describe('#isFinished()', () => {
    it('returns true when the iteration has finished', () => {
      const now = startedAt + itr.totalTimeInMillis
      assert(itr.isFinished(now))
    })

    it('returns false when the iteration has not finished', () => {
      assert(!itr.isFinished(startedAt))
    })

    it('returns false when the iteration has remain times more than 500 ms', () => {
      assert(!itr.isFinished(startedAt))
      const now = (startedAt + itr.remainTimeInMillis(startedAt)) - 500
      assert(!itr.isFinished(now))
    })

    it('returns true when the iteration has remain times less than 500 ms', () => {
      assert(!itr.isFinished(startedAt))
      const now = (startedAt + itr.remainTimeInMillis(startedAt)) - 499
      assert(itr.isFinished(now))
    })
  })
})
