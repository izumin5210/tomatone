/* @flow */
/* eslint-disable import/prefer-default-export */

import {
  MessageLevel,
  MessageDurationType,
} from "../entities";

export const PUSH_MESSAGE = "message:push";
export const REMOVE_MESSAGE = "message:remove";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export type PushMessage = {
  body:         string;
  level:        ?MessageLevel,
  durationType: ?MessageDurationType,
};

/* eslint-enable */
