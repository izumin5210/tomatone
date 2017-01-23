/* @flow */
import Iteration from '../../../src/entities/iteration'
import Task      from '../../../src/entities/task'

import {
  db,
  iterationDao as dao,
} from '../../../src/db'

describe('IterationDao', () => {
  // TODO: Should move to test-helper
  beforeEach(() => db.delete().then(db.open))
  afterEach(() => db.delete().then(db.close))

  beforeEach(() => db.tasks.bulkPut([
    { title: 'awesome task 1' },
    { title: 'awesome task 2' },
    { title: 'awesome task 3' },
    { title: 'awesome task 4' },
  ]))

  describe('#getAll()', () => {
    it('returns all saved iterations', async () => {
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
      const itrs = await dao.getAll()
      assert(itrs.size === 8)
    })
  })

  describe('#createFirst()', () => {
    it('creates a 1st WORK iteration', async () => {
      const task = new Task(await db.tasks.get(2))
      const itr = await dao.createFirst(task)
      assert(itr.type === 'WORK')
      assert(itr.numOfIteration === 1)
      assert(itr.taskId === 2)
      assert(await db.iterations.count() === 1)
    })
  })

  describe('#next()', () => {
    it('create a WORK iteration and increments numOfIteration after SHORT_BREAK', async () => {
      await db.iterations.put({ type: 'SHORT_BREAK', numOfIteration: 2 })
      const itr = new Iteration(await db.iterations.get(1))
      const task = new Task(await db.tasks.get(2))
      const nextItr = await dao.next(itr, task)
      assert(nextItr.type === 'WORK')
      assert(nextItr.numOfIteration === 3)
      assert(nextItr.taskId === 2)
      assert(await db.iterations.count() === 2)
    })

    it('create a WORK iteration and increments numOfIteration after LONG_BREAK', async () => {
      await db.iterations.put({ type: 'LONG_BREAK', numOfIteration: 4 })
      const itr = new Iteration(await db.iterations.get(1))
      const task = new Task(await db.tasks.get(2))
      const nextItr = await dao.next(itr, task)
      assert(nextItr.type === 'WORK')
      assert(nextItr.numOfIteration === 5)
      assert(nextItr.taskId === 2)
      assert(await db.iterations.count() === 2)
    })

    it('create a SHORT_BREAK iteration after a 2nd WORK iteration', async () => {
      await db.iterations.put({ type: 'WORK', numOfIteration: 2 })
      const itr = new Iteration(await db.iterations.get(1))
      const task = new Task(await db.tasks.get(2))
      const nextItr = await dao.next(itr, task)
      assert(nextItr.type === 'SHORT_BREAK')
      assert(nextItr.numOfIteration === 2)
      assert(nextItr.taskId === undefined)
      assert(await db.iterations.count() === 2)
    })

    it('create a LONG_BREAK iteration after a 4th WORK iteration', async () => {
      await db.iterations.put({ type: 'WORK', numOfIteration: 4 })
      const itr = new Iteration(await db.iterations.get(1))
      const task = new Task(await db.tasks.get(2))
      const nextItr = await dao.next(itr, task)
      assert(nextItr.type === 'LONG_BREAK')
      assert(nextItr.numOfIteration === 4)
      assert(nextItr.taskId === undefined)
      assert(await db.iterations.count() === 2)
    })
  })

  describe('#stop()', () => {
    it('update totalTimeInMillis', async () => {
      let ms = 0
      const task = new Task(await db.tasks.get(1))
      let itr = await dao.createFirst(task)
      ms = itr.totalTimeInMillis
      itr = await dao.stop(itr)
      assert(itr.totalTimeInMillis < ms)
      assert(await db.iterations.count() === 1)
    })
  })

  describe('#setTask()', () => {
    it('sets the given task to the iteration', async () => {
      await db.iterations.put({ type: 'WORK', numOfIteration: 1, taskId: 1 })
      const itr = new Iteration(await db.iterations.get(1))
      const task = new Task(await db.tasks.get(2))
      const newItr = await dao.setTask(itr, task)
      assert(newItr.taskId === task.id)
    })
  })
})
