/* @flow */
import Category from 'entities/category'

describe('Category', () => {
  let category: Category

  describe('#isParentOf()', () => {
    let other: Category

    beforeEach(() => {
      category = new Category({ name: 'category1/category2/category3' })
    })

    context('when the other category is a parent of the receiver', () => {
      beforeEach(() => {
        other = new Category({ name: 'category1/category2' })
      })

      it('returns false', () => {
        assert(!category.isParentOf(other))
      })
    })

    context('when the other category is a sibling of the receiver', () => {
      beforeEach(() => {
        other = new Category({ name: 'category1/category2/category4' })
      })

      it('returns false', () => {
        assert(!category.isParentOf(other))
      })
    })

    context('when the other category is a nephew of the receiver', () => {
      beforeEach(() => {
        other = new Category({ name: 'category1/category2/category5/category6' })
      })

      it('returns false', () => {
        assert(!category.isParentOf(other))
      })
    })

    context('when the other category is a child of the receiver', () => {
      beforeEach(() => {
        other = new Category({ name: 'category1/category2/category3/category7' })
      })

      it('returns true', () => {
        assert(category.isParentOf(other))
      })
    })
  })
})
