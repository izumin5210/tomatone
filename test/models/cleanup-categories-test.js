/* @flow */
import { List, Map } from 'immutable'

import cleanupCategories from '../../src/models/cleanup-categories'

import {
  Category,
  Task,
} from '../../src/entities'

import {
  db,
  CategoryDao,
} from '../../src/db'

import { FakeDateTimeProvider }  from '../support'

const now = Date.now('2016-12-01T12:34:56')

describe('cleanupCategories()', () => {
  let dao: CategoryDao
  let dateTimeProvider: FakeDateTimeProvider

  let categories: Map<number, Category>
  let tasks: Map<number, Task>
  let deletedCategories: List<Category>

  // TODO: Should move to test-helper
  beforeEach(() => db.delete().then(db.open))
  afterEach(() => db.delete().then(db.close))

  const createRecords = async (
    categoryAttrsList: Array<{ name: string }>,
    taskAttrsList: Array<{ title: string, categoryId: number }>,
  ) => {
    await db.categories.bulkPut(categoryAttrsList)
    await db.tasks.bulkPut(taskAttrsList)
    categories = (await db.categories.toArray())
      .map(attrs => new Category(attrs))
      .reduce((m, c) => m.set(c.id, c), Map())
    tasks = (await db.tasks.toArray())
      .map(attrs => new Task(attrs))
      .reduce((m, t) => m.set(t.id, t), Map())
    assert(await db.categories.count() === categoryAttrsList.length)
    assert(await db.tasks.count() === taskAttrsList.length)
  }

  beforeEach(async () => {
    dateTimeProvider = new FakeDateTimeProvider(now)
    dao = new CategoryDao(db, dateTimeProvider)
    await createRecords(
      [
        { name: 'c1' },
        { name: 'c2' },
        { name: 'c1/c3' },
        { name: 'c1/c4' },
        { name: 'c1/c3/c5' }, // id: 5
        { name: 'c1/c3/c6' },
        { name: 'c1/c7' },    // id: 7
        { name: 'c1/c7/c8' },
        { name: 'c2/c9' },
        { name: 'c2/c9/c10' },
      ],
      [
        { title: 't1', categoryId: 5 },
        { title: 't2', categoryId: 7 },
      ],
    )
    deletedCategories = await cleanupCategories(categories, tasks, dao)
  })

  it('remains 5 categories', async () => {
    assert(deletedCategories.size === 6)
    assert((await db.categories.count()) === 4)
  })

  it('removes leaf categories that has no tasks', async () => {
    assert(deletedCategories.find(({ id }) => id === 4) != null)
    assert(await db.categories.get(4) == null)
    assert(deletedCategories.find(({ id }) => id === 6) != null)
    assert(await db.categories.get(6) == null)
  })

  it('remains leaf categories that has any tasks', async () => {
    assert(deletedCategories.find(({ id }) => id === 5) == null)
    assert((await db.categories.get(5)).name === 'c1/c3/c5')
  })

  it('stop removing recursively when a middle node has any tasks', async () => {
    assert(deletedCategories.find(({ id }) => id === 8) != null)
    assert(await db.categories.get(8) == null)
    assert(deletedCategories.find(({ id }) => id === 7) == null)
    assert((await db.categories.get(7)).name === 'c1/c7')
  })

  it('removes an empty tree recursively', async () => {
    assert(deletedCategories.find(({ id }) => id === 2) != null)
    assert(await db.categories.get(2) == null)
    assert(deletedCategories.find(({ id }) => id === 9) != null)
    assert(await db.categories.get(9) == null)
    assert(deletedCategories.find(({ id }) => id === 10) != null)
    assert(await db.categories.get(10) == null)
  })
})
