/* @flow */

import type {
  MessageLevel,
  MessageDurationType,
} from '../entities'

export const PUSH_MESSAGE = 'message:push'
export const REMOVE_MESSAGE = 'message:remove'

export type PushMessage = {
  body: string,
  level?: MessageLevel,
  durationType?: MessageDurationType,
}
