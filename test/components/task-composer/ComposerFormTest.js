/* @flow */

import { mount }  from 'enzyme'
import { spy }      from 'sinon'

import { Map } from 'immutable'

import Category from '../../../src/entities/category'

import ComposerForm   from '../../../src/components/task-composer/ComposerForm'
import type { Props } from '../../../src/components/task-composer/ComposerForm'

describe('<ComposerForm />', () => {
  let props: Props
  let event: any

  beforeEach(() => {
    props = {
      currentCategory: Category.ALL,
      categories:      Map(),
      createTask:      spy(),
      close:           spy(),
    }
    event = {
      preventDefault: spy(),
    }
  })

  context('when currentCategory is a meta category', () => {
    beforeEach(() => {
      props.currentCategory = Category.ALL
    })

    it('create a new task when the btn-create is clicked', () => {
      const wrapper = mount(<ComposerForm {...props} />)
      const inputEl = wrapper.find('.ComposerForm__input-title')
      assert(inputEl.props().value === '')
    })
  })

  context('when currentCategory is not a meta category', () => {
    beforeEach(() => {
      props.currentCategory = new Category({ name: 'awesome category/nested category' })
    })

    it('create a new task when the btn-create is clicked', () => {
      const wrapper = mount(<ComposerForm {...props} />)
      const inputEl = wrapper.find('.ComposerForm__input-title')
      assert(inputEl.props().value === `${props.currentCategory.name}/`)
    })
  })

  it('create a new task when the btn-create is clicked', () => {
    const wrapper = mount(<ComposerForm {...props} />)
    wrapper.find('.ComposerForm__input-title')
      .simulate('change', { target: { value: 'new task' } })
    wrapper.find('.ComposerForm__btn-create').simulate('click', event)
    assert(props.createTask.calledOnce)
    assert(props.createTask.args[0][0] === 'new task')
    assert(props.close.calledOnce)
  })

  it('create a new task when the form is submitted', () => {
    const wrapper = mount(<ComposerForm {...props} />)
    wrapper.find('.ComposerForm__input-title')
      .simulate('change', { target: { value: 'new task' } })
    wrapper.find('.ComposerForm').simulate('submit', event)
    assert(props.createTask.calledOnce)
    assert(props.createTask.args[0][0] === 'new task')
    assert(props.close.calledOnce)
  })

  it('does not create new task when the form is empty and the btn-create is clicked', () => {
    const wrapper = mount(<ComposerForm {...props} />)
    wrapper.find('.ComposerForm__btn-create').simulate('click', event)
    assert(!props.createTask.called)
    assert(!props.close.calledOnce)
  })

  it('does not create new task when the form is empty and the form is submitted', () => {
    const wrapper = mount(<ComposerForm {...props} />)
    wrapper.find('.ComposerForm').simulate('submit', event)
    assert(!props.createTask.called)
    assert(!props.close.calledOnce)
  })
})
