/* @flow */
import { List } from 'immutable'

import {
  pushMessage,
  removeMessage,
} from '../../src/reducers/messages'

import {
  Message,
} from '../../src/entities'

import {
  State,
} from '../../src/models'

describe('messages reducer', () => {
  describe('#pushMessage()', () => {
    it('adds new messages to the end of the list', () => {
      const state = new State()
      assert(state.messages.size === 0)
      let newState = pushMessage(state, { body: 'test 1' })
      assert(newState.messages.size === 1)
      assert(newState.messages.first().body === 'test 1')
      assert(newState.messages.first().level === 'DEBUG')
      assert(newState.messages.first().durationType === 'SHORT')
      newState = pushMessage(newState, { body: 'test 2', level: 'INFO', durationType: 'LONG' })
      assert(newState.messages.get(1).body === 'test 2')
      assert(newState.messages.get(1).level === 'INFO')
      assert(newState.messages.get(1).durationType === 'LONG')
      assert(newState.messages.size === 2)
    })
  })

  describe('#removeMessage()', () => {
    it('deletes oldest messages', () => {
      const state = new State({
        messages: List.of(
          new Message({ body: 'test 1' }),
          new Message({ body: 'test 2' }),
        ),
      })
      assert(state.messages.size === 2)
      assert(state.messages.first().body === 'test 1')
      let newState = removeMessage(state)
      assert(newState.messages.size === 1)
      assert(newState.messages.first().body === 'test 2')
      newState = removeMessage(newState)
      assert(newState.messages.size === 0)
    })
  })
})
