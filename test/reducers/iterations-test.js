/* @flow */
import { Map } from 'immutable'

import {
  getAllIterations,
} from 'reducers/iterations'

import Iteration from 'entities/iteration'

import State from 'models/state'

import { db } from 'db'

describe('iterations reducer', () => {
  // TODO: Should move to test-helper
  beforeEach(() => db.delete().then(db.open))
  afterEach(() => db.delete().then(db.close))

  describe('#getAllIterations()', () => {
    beforeEach(async () => {
      let i = 1
      await db.iterations.bulkPut([
        { type: 'WORK', numOfIteration: i },
        { type: 'SHORT_BREAK', numOfIteration: (i += 1) },
        { type: 'WORK', numOfIteration: i },
        { type: 'SHORT_BREAK', numOfIteration: (i += 1) },
        { type: 'WORK', numOfIteration: i },
        { type: 'SHORT_BREAK', numOfIteration: (i += 1) },
        { type: 'WORK', numOfIteration: i },
        { type: 'LONG_BREAK', numOfIteration: (i += 1) },
      ])
      assert(await db.iterations.count() === 8)
    })

    it('returns all iterations stored on IndexedBD', async () => {
      const { iterations } = await getAllIterations(new State())
      assert(iterations.size === 8)
    })

    it('returns new iterations when the state has an older one', async () => {
      const itr = new Iteration(await db.iterations.get(1))
      const state = new State({
        iterations: Map([[itr.id, itr]]),
      })
      await db.iterations.update(1, { totalTimeInMillis: 3 * 60 * 1000 })
      const { iterations } = await getAllIterations(state)
      assert(iterations.size === 8)
      assert(iterations.get(1).totalTimeInMillis != null)
    })
  })
})
