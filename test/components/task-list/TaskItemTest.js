/* @flow */
import { mount } from 'enzyme'
import { spy }   from 'sinon'

import { Map } from 'immutable'

import React, { Component } from 'react'
import { DragDropContext }  from 'react-dnd'
import TestBackend          from 'react-dnd-test-backend'

import TaskItem       from 'components/task-list/TaskItem'
import type { Props } from 'components/task-list/TaskItem'

import Category from 'entities/category'
import Task     from 'entities/task'

function wrapInTestContext (DecoratedComponent) {
  // eslint-disable-next-line react/prefer-stateless-function
  @DragDropContext(TestBackend)
  class TestContextContainer extends Component {
    render () {
      return <DecoratedComponent {...this.props} />
    }
  }

  return TestContextContainer
}

describe('<TaskItem />', () => {
  let props: Props
  let wrapper

  beforeEach(() => {
    const TaskItemContext = wrapInTestContext(TaskItem)
    const task = new Task({ id: 1, title: 'awesome task' })
    props = {
      task,
      category:          Category.NO_CATEGORY,
      categories:        Map(),
      order:             0,
      check:             spy(),
      select:            spy(),
      update:            spy(),
      delete:            spy(),
      selected:          false,
      drag:              spy(),
      drop:              spy(),
      connectDragSource: spy(),
      connectDropTarget: spy(),
      isDragging:        false,
      canDrop:           false,
    }
    wrapper = mount(<TaskItemContext {...props} />)
  })

  describe('completeTask', () => {
    it('calls check() when an icon is clicked', () => {
      assert(!props.check.called)
      wrapper.find('.TaskItem__complete')
        .simulate('change', { target: { value: true } })
      assert(props.check.calledOnce)
    })
  })

  describe('selectTask', () => {
    it('calls select() when an item body is clicked', () => {
      assert(!props.select.called)
      wrapper.find('.TaskItem__select')
        .simulate('change', { target: { value: true } })
      assert(props.select.calledOnce)
    })
  })

  describe('re-order tasks', () => {
    xit('drags-and-drops a task to above')
    xit('drags-and-drops a task to below')
  })
})
