/* @flow */
import { List } from 'immutable'
import Category from '../../../src/entities/category'

import {
  db,
} from '../../../src/db'

import CategoryDao from '../../../src/db/dao/category-dao'

import { FakeDateTimeProvider }  from '../../support'

const now = Date.now('2016-12-01T12:34:56')

describe('CategoryDao', () => {
  let dao: CategoryDao
  let dateTimeProvider: FakeDateTimeProvider

  // TODO: Should move to test-helper
  beforeEach(() => db.delete().then(db.open))
  afterEach(() => db.delete().then(db.close))

  beforeEach(() => {
    dateTimeProvider = new FakeDateTimeProvider(now)
    dao = new CategoryDao(db, dateTimeProvider)
  })

  describe('#getAll()', () => {
    it('returns empty list', async () => {
      const categories = await dao.getAll()
      assert(categories.size === 0)
    })

    it('returns all saved iterations', async () => {
      await db.categories.bulkPut([
        { name: 'awesome category 1', createdAt: Date.now() },
        { name: 'awesome category 2', createdAt: Date.now() },
        { name: 'awesome category 3', createdAt: Date.now() },
        { name: 'awesome category 4', createdAt: Date.now() },
      ])
      assert(await db.categories.count() === 4)
      const categories = await dao.getAll()
      assert(categories.size === 4)
    })
  })

  describe('#findOrCreateByName()', () => {
    const name = 'awesome category'

    beforeEach(async () => {
      await db.categories.put({ name, createdAt: now })
      dateTimeProvider.tick(10)
    })

    context('when a category that has the given name has already exists', () => {
      it('returns the existing category', async () => {
        const category = await dao.findOrCreateByName(name)
        assert(category.id === 1)
        assert(category.name === name)
        assert(category.createdAt === now)
        assert(await db.categories.count() === 1)
      })
    })

    context('when a category that has the given name has not exists', () => {
      it('returns a new category', async () => {
        const category = await dao.findOrCreateByName('alternative category')
        assert(category.id === 2)
        assert(category.name === 'alternative category')
        assert(category.createdAt === now + 10)
        assert(await db.categories.count() === 2)
      })
    })
  })

  describe('#update()', () => {
    it('returns an updated category', async () => {
      const id = await db.categories.put({ name: 'awesome category' })
      let category = new Category(await db.categories.get(id))
        .set('name', 'alternative category')
      category = await dao.update(category)
      assert(category.name === 'alternative category')
      assert(await db.categories.count() === 1)
    })
  })

  describe('#delete()', () => {
    it('returns the deleted category', async () => {
      const id = await db.categories.put({ title: 'awesome category' })
      const category = new Category(await db.categories.get(id))
      await dao.delete(category)
      assert(await db.categories.count() === 0)
    })
  })

  describe('#deleteAll()', () => {
    it('returns deleted categories', async () => {
      await db.categories.bulkPut([
        { name: 'c1' },
        { name: 'c2' },
        { name: 'c1/c3' },
        { name: 'c1/c3/c4' },
      ])
      let categories = (await db.categories.toArray())
        .map(attrs => new Category(attrs))
      categories = List.of(categories[1], categories[3])
      categories = await dao.deleteAll(categories)
      assert(categories.size === 2)
      assert(categories.find(({ id }) => id === 2) != null)
      assert(categories.find(({ id }) => id === 4) != null)
      assert(await db.categories.get(2) == null)
      assert(await db.categories.get(4) == null)
      assert(await db.categories.count() === 2)
    })
  })
})
