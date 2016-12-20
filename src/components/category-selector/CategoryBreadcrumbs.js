/* @flow */
import React    from "react";
import { Link } from "react-router";
import { Map }  from "immutable";

import {
  Category,
} from "../../entities";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export type Props = {
  currentCategory: Category;
  categories:      Map<number, Category>;
};
/* eslint-enable */

export default function CategoryBreadcrumbs({ currentCategory, categories }: Props) {
  if (!categories.has(currentCategory.id)) {
    return null;
  }

  const items = categories
      .filter(cat => cat.isParentOf(currentCategory) || (cat.id === currentCategory.id))
      .sortBy(cat => cat.depth)
      .map(cat => (
        <li key={`category-${cat.id}`} className="CategoryBreadcrumbs__item">
          <Link
            to={{ pathname: "/tasks", query: { category: cat.path } }}
          >
            {cat.subName}
          </Link>
        </li>
      ))
      .toArray();

  return (
    <ul className="CategoryBreadcrumbs">
      {items}
    </ul>
  );
}
