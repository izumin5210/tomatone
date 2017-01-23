/* @flow */
import { Task } from '../entities'

export const GET_ALL      = 'task:getall'
export const CREATE       = 'task:create'
export const UPDATE       = 'task:udpate'
export const COMPLETE     = 'task:complete'
export const INCOMPLETE   = 'task:incomplete'
export const SELECT       = 'task:select'
export const DELETE       = 'task:delete'
export const UPDATE_ORDER = 'task:update-order'

export type CreateAction = {
  title: string,
}

export type UpdateAction = {
  task: Task,
}

export type CompleteAction = {
  task: Task,
}

export type IncompleteAction = {
  task: Task,
}

export type SelectAction = {
  task: ?Task,
}

export type DeleteAction = {
  task: Task,
}

export type UpdateOrderAction = {
  task: Task,
  order: number,
}
