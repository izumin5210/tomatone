/* @flow */
import { useFakeTimers }   from 'sinon'

import { Map } from 'immutable'

import {
  startTimer,
  stopTimer,
  refreshTimer,
  restartTimer,
} from 'reducers/timer'

import Iteration from 'entities/iteration'
import Timer     from 'entities/timer'
import Task      from 'entities/task'

import State from 'models/state'

import { db } from 'db'

describe('timer reducer', () => {
  let state: State

  // TODO: Should move to test-helper
  beforeEach(() => db.delete().then(db.open))
  afterEach(() => db.delete().then(db.close))

  beforeEach(async () => {
    await db.tasks.bulkPut([
      { title: 'awesome task 1' },
      { title: 'awesome task 2' },
      { title: 'awesome task 3' },
      { title: 'awesome task 4' },
    ])
    const tasks = (await db.tasks.toArray())
      .map(attrs => new Task(attrs))
      .reduce((m, t) => m.set(t.id, t), Map())
    state = new State({ tasks })
  })

  describe('startTimer()', () => {
    let itr: Iteration
    let task: Task

    beforeEach(async () => {
      task = new Task(await db.tasks.get(3))
    })

    context('when the timer has a running iteration', () => {
      beforeEach(async () => {
        const id = await db.iterations.put({ totalTimeInMillis: 0, taskId: task.id })
        itr = new Iteration(await db.iterations.get(id))
        state = state.set('iterations', state.iterations.set(itr.id, itr))
        state = state.set('timer', state.timer.updateIteration(itr))
      })

      it('push an error message when the timer has not a selected task', async () => {
        const { iterations, messages } = await startTimer(state)
        assert(messages.size === 1)
        assert(messages.get(0).body != null)
        assert(iterations.size === 1)
      })

      it('returns new state when the state has some iterations', async () => {
        state = state.set('timer', state.timer.set('selectedTaskId', task.id))
        const { iterations, timer } = await startTimer(state)
        assert(iterations.size === 2)
        assert(timer.currentIterationId === 2)
        assert(timer.totalTimeInMillis === iterations.get(2).totalTimeInMillis)
        assert(timer.remainTimeInMillis <= iterations.get(2).totalTimeInMillis)
      })
    })

    context('when the timer does not have a running iteration', () => {
      it('push an error message when the timer has not a selected task', async () => {
        const { iterations, messages } = await startTimer(state)
        assert(messages.size === 1)
        assert(iterations.size === 0)
      })

      it('returns new state when the state has no iterations', async () => {
        state = state.set('timer', state.timer.set('selectedTaskId', state.tasks.get(3).id))
        const { iterations, timer } = await startTimer(state)
        assert(iterations.size === 1)
        assert(timer.currentIterationId === 1)
        assert(timer.totalTimeInMillis === iterations.get(1).totalTimeInMillis)
        assert(timer.remainTimeInMillis <= iterations.get(1).totalTimeInMillis)
        assert(iterations.get(1).taskId === 3)
      })
    })
  })

  describe('stopTimer()', () => {
    it('returns new state that has stopped timer', async () => {
      const itr = new Iteration()
      state = new State({
        iterations: Map([[itr.id, itr]]),
        timer:      new Timer({ currentIterationId: itr.id }),
      })
      const { iterations, timer } = await stopTimer(state)
      assert(iterations.size === 1)
      assert(timer.currentIterationId === undefined)
      assert(timer.totalTimeInMillis === 0)
      assert(timer.remainTimeInMillis === 0)
    })
  })

  describe('refreshTimer()', () => {
    it("returns new state that timer's times are refreshed", async () => {
      const startedAt = Date.now()
      const itr = new Iteration({ startedAt })
      state = new State({
        iterations: Map([[itr.id, itr]]),
        timer:      new Timer({
          currentIterationId: itr.id,
          totalTimeInMillis:  itr.totalTimeInMillis,
          remainTimeInMillis: itr.remainTimeInMillis(startedAt),
        }),
      })
      const { timer } = await refreshTimer(state, { nowInMilliSeconds: startedAt + 10 })
      assert(timer.totalTimeInMillis === itr.totalTimeInMillis)
      assert(timer.remainTimeInMillis < state.timer.remainTimeInMillis)
    })

    it('returns new state that started new iteration', async () => {
      const startedAt = Date.now()
      await db.iterations.put({ totalTimeInMillis: 0, startedAt })
      const itr = new Iteration(await db.iterations.get(1))
      const task = new Task(await db.tasks.get(2))
      state = state.set('iterations', Map([[itr.id, itr]]))
      state = state.set(
        'timer',
        state.timer.set('currentIterationId', itr.id).set('selectedTaskId', task.id),
      )
      const { iterations, timer } = await refreshTimer(state, { nowInMilliSeconds: startedAt })
      assert(iterations.size === 2)
      const latestItr = iterations.maxBy(i => i.id)
      assert(timer.currentIterationId === latestItr.id)
      assert(timer.totalTimeInMillis === latestItr.totalTimeInMillis)
      assert(timer.remainTimeInMillis <= latestItr.totalTimeInMillis)
    })

    it('returns new state that timer has no active iterations', async () => {
      state = state.set(
        'timer',
        state.timer.set('totalTimeInMillis', 60 * 1000).set('remainTimeInMillis', 60 * 1000),
      )
      const { timer } = await refreshTimer(state, { nowInMilliSeconds: Date.now() })
      assert(timer.totalTimeInMillis === 0)
      assert(timer.remainTimeInMillis === 0)
    })
  })

  describe('#restartTimer()', () => {
    let iteration: Iteration
    let clock
    const now = Date.now('2016-12-01T12:34:56')

    beforeEach(async () => {
      clock = useFakeTimers(now)
      await db.tasks.put({ title: 'awesome task' })
      await db.iterations.put({ type: 'WORK', taskId: 1 })
      iteration = new Iteration(await db.iterations.get(1))
    })

    afterEach(() => {
      clock.restore()
    })

    context('when the latest iteration has not finished', () => {
      beforeEach(() => {
        clock.tick(iteration.totalTimeInMillis + 1000)
      })

      xit('returns new state that has restarted tiemr', async () => {
        const { iterations, timer } = await restartTimer(
          new State(),
          { nowInMilliSeconds: Date.now() },
        )
        assert(timer.currentIterationId === iteration.id)
        assert(iterations.size === 1)
      })
    })

    context('when the latest iteration has not finished', async () => {
      xit('returns new state that has not-restarted timer', async () => {
        const { iterations, timer } = await restartTimer(
          new State(),
          { nowInMilliSeconds: Date.now() },
        )
        assert(timer.currentIterationId == null)
        assert(iterations.size === 1)
      })
    })
  })
})
