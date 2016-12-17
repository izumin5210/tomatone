/* @flow */

import {
  State,
} from "../models";

import {
  categoryDao,
} from "../db";

/* eslint-disable import/prefer-default-export */
export function getAllCategories(state: State): Promise<State> {
  return categoryDao.getAll()
    .then(categories => categories.reduce(
      (map, category) => map.set(category.id, category),
      state.categories,
    ))
    .then(categories => state.set("categories", categories));
}
/* eslint-enable */
