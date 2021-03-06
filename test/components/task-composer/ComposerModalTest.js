/* @flow */
import { shallow } from 'enzyme'
import { spy }     from 'sinon'

import ComposerModal  from 'components/task-composer/ComposerModal'
import type { Props } from 'components/task-composer/ComposerModal'

describe('<ComposerModal />', () => {
  let props: Props

  beforeEach(() => {
    props = {
      children: (<h1>test modal</h1>),
      close:    spy(),
    }
  })

  it('calls close() when the modal shade is clicked', () => {
    const wrapper = shallow(<ComposerModal {...props} />)
    assert(!props.close.called)
    wrapper.find('.ComposerModal').simulate('click')
    assert(props.close.calledOnce)
  })

  it('does not call close() when the modal is clicked', () => {
    const wrapper = shallow(<ComposerModal {...props} />)
    const spiesEvent = {
      stopPropagation: spy(),
      preventDefault:  spy(),
    }
    assert(!props.close.called)
    wrapper.find('.ComposerModal__modal').simulate('click', spiesEvent)
    assert(!props.close.called)
    assert(spiesEvent.stopPropagation.calledOnce)
    assert(spiesEvent.preventDefault.calledOnce)
  })
})
