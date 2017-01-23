/* @flow */
import { Record } from 'immutable'

export const MessageDuration = {
  SHORT: 3000,
  LONG:  5000,
}

export type MessageDurationType = $Keys<typeof MessageDuration>

export type MessageLevel =
  "DEBUG" |
  "INFO" |
  "WARN" |
  "ERROR" |
  "FATAL"

export type MessageConfig = {
  body: string,
  level: MessageLevel,
  durationType: MessageDurationType,
}

const defaultValues: MessageConfig = {
  body:         '',
  level:        'DEBUG',
  durationType: 'SHORT',
}

const MessageRecord = Record(defaultValues)

export default class Message extends MessageRecord {
  get duration (): number {
    return MessageDuration[this.durationType]
  }
}
