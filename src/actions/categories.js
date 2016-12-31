/* @flow */
import { Category } from "../entities";

/* eslint-disable no-multi-spaces */
export const GET_ALL = "category:getall";
export const CREATE  = "category:create";
export const SELECT  = "category:select";
/* eslint-enable */

export type SelectAction = {
  category: ?Category;
};
