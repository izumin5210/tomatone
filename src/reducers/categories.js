/* @flow */
import { Set } from "immutable";

import {
  cleanupCategories,
  State,
} from "../models";

import {
  categoryDao,
} from "../db";


type Node = {
  id: number;
  count: number;
  childIds: Set<number>;
  children: Array<Node>;
};


export function getAllCategories(state: State): Promise<State> {
  return categoryDao.getAll()
    .then(categories => categories.reduce(
      (map, category) => map.set(category.id, category),
      state.categories,
    ))
    .then(categories => state.set("categories", categories));
}

export async function deleteUnusedCategories(state: State): Promise<State> {
  const deletedCategories = await cleanupCategories(state.categories, state.tasks, categoryDao);
  const categories = state.categories
    .filterNot(({ id }) => deletedCategories.find(c => c.id === id) != null);
  return state.set("categories", categories);
}
