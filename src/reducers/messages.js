/* @flow */
/* eslint-disable import/prefer-default-export */

import {
  State,
} from "../models";

import {
  Message,
} from "../entities";

import {
  MessagesActions,
} from "../actions";

export function pushMessage(state: State, action: MessagesActions.PushMessage): State {
  return state.set("messages", state.messages.push(new Message(action)));
}

export function removeMessage(state: State): State {
  return state.set("messages", state.messages.skip(1));
}

/* eslint-enable */
