/* @flow */
import { List, Map, Set } from 'immutable'

import {
  Category,
  Task,
} from '../entities'

import type {
  CategoryDao,
} from '../db'

type Node = {
  id: number,
  count: number,
  childIds: Set<number>,
  children: Array<Node>,
}

function createCategoryTrees (
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
        .filterNot(({ id }) => id === category.id)
      return {
        id:       category.id,
        count:    tasks.count(t => category.id === t.categoryId),
        childIds: childCategories.map(({ id }) => id).toSet(),
        children: createCategoryTrees(childCategories, tasks, depth + 1),
      }
    })
    .toArray()
}

function searchDeletableNodes ({ id, count, childIds, children }: Node): Set<number> {
  let deletable = children
    .reduce((s, n) => s.union(searchDeletableNodes(n)), Set())
  if (childIds.every(i => deletable.has(i)) && count === 0) {
    deletable = deletable.add(id)
  }
  return deletable
}

function searchDeletableIds (
  categories: Map<number, Category>,
  tasks: Map<number, Task>,
): Set<number> {
  const nodes = createCategoryTrees(categories, tasks, 1)
  return nodes
    .map(node => searchDeletableNodes(node))
    .reduce((set, ids) => set.union(ids), Set())
}

/**
 * Delete unused categories recursively.
 * @param {Map<number, Category>} categories - all categories.
 * @param {Map<number, Task>} categories - all tasks.
 * @param {TaskDao} - a database access object for accessing to tasks table.
 * @return {Promise<List<number>>} - return deleted category ids.
 */
export default async function cleanupCategories (
  categories: Map<number, Category>,
  tasks: Map<number, Task>,
  dao: CategoryDao,
): Promise<List<Category>> {
  const deletableIds = searchDeletableIds(categories, tasks)
  const deletableCategories = categories
    .filter(({ id }) => deletableIds.includes(id))
    .toList()
  return dao.deleteAll(deletableCategories)
}
