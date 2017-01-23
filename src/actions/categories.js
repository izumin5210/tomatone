/* @flow */
import { Category } from '../entities'

export const GET_ALL = 'category:getall'
export const CREATE  = 'category:create'
export const SELECT  = 'category:select'

export type SelectAction = {
  category: ?Category,
}
