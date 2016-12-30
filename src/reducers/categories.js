/* @flow */
import { Map, Set } from "immutable";

import {
  State,
} from "../models";

import {
  Category,
  Task,
} from "../../src/entities";

import {
  categoryDao,
} from "../db";

type Node = {
  id: number;
  count: number;
  childIds: Set<number>;
  children: Array<Node>;
};

function createCategoryTrees(
  categories: Map<number, Category>,
  tasks: Map<number, Task>,
  depth: number,
): Array<Node> {
  return categories
    .filter(category => category.depth === depth)
    .filterNot(category => category.isMeta)
    .map((category) => {
      const childCategories = categories
        .filter(({ name }) => name.startsWith(category.name))
        .filterNot(({ id }) => id === category.id);
      return {
        id:       category.id,
        count:    tasks.count(t => category.id === t.categoryId),
        childIds: childCategories.map(({ id }) => id).toSet(),
        children: createCategoryTrees(childCategories, tasks, depth + 1),
      };
    })
    .toArray();
}

function searchDeletableNodes({ id, count, childIds, children }: Node): Set<number> {
  let deletable = children
    .reduce((s, n) => s.union(searchDeletableNodes(n)), Set());
  if (childIds.every(i => deletable.has(i)) && count === 0) {
    deletable = deletable.add(id);
  }
  return deletable;
}

export function getAllCategories(state: State): Promise<State> {
  return categoryDao.getAll()
    .then(categories => categories.reduce(
      (map, category) => map.set(category.id, category),
      state.categories,
    ))
    .then(categories => state.set("categories", categories));
}

export async function deleteUnusedCategories(state: State): Promise<State> {
  const nodes = createCategoryTrees(state.categories, state.tasks, 1);
  const deletableIds = nodes
    .map(node => searchDeletableNodes(node))
    .reduce((set, ids) => set.union(ids), Set());
  let deletableCategories = state.categories
    .filter(({ id }) => deletableIds.includes(id))
    .toList();
  deletableCategories = await categoryDao.deleteAll(deletableCategories);
  const categories = state.categories
    .filterNot(({ id }) => deletableCategories.find(c => c.id === id) != null);
  return state.set("categories", categories);
}

