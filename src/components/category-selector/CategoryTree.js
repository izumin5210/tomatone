/* @flow */
import React    from "react";
import { Map }  from "immutable";

import {
  Category,
} from "../../entities";

import CategoryNode from "./CategoryNode";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export type Props = {
  currentCategory: Category;
  categories:      Map<number, Category>;
  taskCounts:      Map<number, number>;
  close:           () => void;
  depth:           number;
};
/* eslint-enable */

export default function CategoryTree(
  { currentCategory, categories, taskCounts, close, depth }: Props,
) {
  const items = categories
    .filter(category => category.depth === depth)
    .sortBy(category => category.name)
    .map((category) => {
      const childCategories = categories
        .filter(({ name }) => name.startsWith(category.name))
        .filterNot(({ id }) => id === category.id);
      return (
        <CategoryNode
          key={`category-tree-item-${category.id}`}
          {...{ currentCategory, category, taskCounts, close }}
        >
          { !childCategories.isEmpty() ? (
            <CategoryTree
              {...{ currentCategory, taskCounts }}
              categories={childCategories}
              close={close}
              depth={depth + 1}
            />
          ) : null }
        </CategoryNode>
      );
    })
    .toArray();
  const modifier = (depth === 1) ? "_root" : "";
  return (
    <div className={`CategoryTree${modifier}`}>
      <ul className={`CategoryTree__list${modifier}`}>
        {items}
      </ul>
    </div>
  );
}