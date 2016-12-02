/* @flow */
import { Record } from "immutable";

export const MessageDuration = {
  SHORT: 3000,
  LONG:  5000,
};

export type MessageDurationType = $Keys<typeof MessageDuration>;

export type MessageLevel =
  "DEBUG" |
  "INFO" |
  "WARN" |
  "ERROR" |
  "FATAL";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export type MessageConfig = {
  body:         string;
  level:        MessageLevel;
  durationType: MessageDurationType;
};
/* eslint-enable */

const defaultValues: MessageConfig = {
  body:         "",
  level:        "DEBUG",
  durationType: "SHORT",
};

const MessageRecord = Record(defaultValues);

export default class Message extends MessageRecord {
  get duration(): number {
    return MessageDuration[this.durationType];
  }
}
