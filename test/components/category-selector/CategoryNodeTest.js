/* @flow */
import { mount } from 'enzyme'
import { spy }   from 'sinon'

import { StaticRouter } from 'react-router'

import Category from 'entities/category'

import CategoryNode   from 'components/category-selector/CategoryNode'
import type { Props } from 'components/category-selector/CategoryNode'

function createWrapper (props: Props) {
  // https://github.com/ReactTraining/react-router/blob/553b56a750072641b532c1113336a706d6f62648/modules/__tests__/Link-test.js#L259-L277
  return mount((
    <StaticRouter
      location={{ pathname: '/', query: { category: '/' } }}
      action='POP'
      onPush={() => {}}
      onReplace={() => {}}
    >
      <CategoryNode {...props} />
    </StaticRouter>
  ))
}

describe('<CategoryNode />', () => {
  let wrapper

  let id: number
  let currentCategory: Category
  let category: Category
  let taskCount: number
  let closeSpy: spy
  let props: Props

  beforeEach(() => {
    id = 0
    closeSpy = spy()
    category = new Category({ id: (id += 1), name: 'category1' })
    currentCategory = new Category({ id: (id += 1), name: 'category2' })
    taskCount = 2
    props = {
      currentCategory,
      category,
      taskCount,
      close:    closeSpy,
      children: null,
    }
  })

  context('when the children is null', () => {
    beforeEach(() => {
      wrapper = createWrapper(props)
    })

    it('does not apply modifiers for .CategoryNode__name', () => {
      assert(wrapper.find('.CategoryNode__name').exists())
      assert(!wrapper.find('.CategoryNode__name_opened').exists())
      assert(!wrapper.find('.CategoryNode__name_closed').exists())
    })

    context('when the .CategoryNode__link is clicked', () => {
      beforeEach(() => {
        wrapper.find('.CategoryNode__link').simulate('click')
      })

      it('calls close()', () => {
        assert(closeSpy.called)
      })
    })
  })

  context('when the children is not null', () => {
    beforeEach(() => {
      props.children = (<p id='CategoryNode__children'>clicked</p>)
    })

    context('when the currentCategory does not related with the category', () => {
      beforeEach(() => {
        wrapper = createWrapper(props)
      })

      it('applies a _closed modifier for .CategoryNode__name', () => {
        assert(!wrapper.find('.CategoryNode__name').exists())
        assert(!wrapper.find('.CategoryNode__name_opened').exists())
        assert(wrapper.find('.CategoryNode__name_closed').exists())
      })

      it('does not display children', () => {
        assert(!wrapper.find('#CategoryNode__children').exists())
      })

      context('when the .CategoryNode__name_closed is clicked', () => {
        beforeEach(() => {
          wrapper.find('.CategoryNode__link').simulate('click')
        })

        it('applies a _opened modifier for .CategoryNode__name', () => {
          assert(!wrapper.find('.CategoryNode__name').exists())
          assert(wrapper.find('.CategoryNode__name_opened').exists())
          assert(!wrapper.find('.CategoryNode__name_closed').exists())
        })

        it('displays children', () => {
          assert(wrapper.find('#CategoryNode__children').exists())
        })

        it('does not call close()', () => {
          assert(!closeSpy.called)
        })

        context('when the .CategoryNode__name_opened is clicked', () => {
          beforeEach(() => {
            wrapper.find('.CategoryNode__link').simulate('click')
          })

          it('applies a _closed modifier for .CategoryNode__name', () => {
            assert(!wrapper.find('.CategoryNode__name').exists())
            assert(!wrapper.find('.CategoryNode__name_opened').exists())
            assert(wrapper.find('.CategoryNode__name_closed').exists())
          })

          it('does not display children', () => {
            assert(!wrapper.find('#CategoryNode__children').exists())
          })

          it('does not call close()', () => {
            assert(!closeSpy.called)
          })
        })
      })
    })

    context('when the currentCategory equals to the category', () => {
      beforeEach(() => {
        props.currentCategory = props.category
        wrapper = createWrapper(props)
      })

      it('applies a _opened modifier for .CategoryNode__name', () => {
        assert(!wrapper.find('.CategoryNode__name').exists())
        assert(wrapper.find('.CategoryNode__name_opened').exists())
        assert(!wrapper.find('.CategoryNode__name_closed').exists())
      })

      it('displays children', () => {
        assert(wrapper.find('#CategoryNode__children').exists())
      })
    })

    context('when the currentCategory is child of the category', () => {
      beforeEach(() => {
        props.currentCategory = new Category({
          id:   (id += 1),
          name: `${props.category.name}/child`,
        })
        wrapper = createWrapper(props)
      })

      it('applies a _opened modifier for .CategoryNode__name', () => {
        assert(!wrapper.find('.CategoryNode__name').exists())
        assert(wrapper.find('.CategoryNode__name_opened').exists())
        assert(!wrapper.find('.CategoryNode__name_closed').exists())
      })

      it('displays children', () => {
        assert(wrapper.find('#CategoryNode__children').exists())
      })
    })
  })
})

