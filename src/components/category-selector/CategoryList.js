/* @flow */
import React    from "react";
import { Link } from "react-router";
import { Map }  from "immutable";

import {
  Category,
  Task,
} from "../../entities";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type Props = {
  categories: Map<number, Category>;
  tasks:      Map<number, Task>;
  close:      () => void;
};
/* eslint-enable */

export default function CategoryList({ categories, tasks, close }: Props) {
  const tasksByCategories = tasks.groupBy(task => task.categoryId);
  const items = categories
    .sortBy(category => category.name)
    .map(({ id, name, path }) => {
      let count = tasksByCategories.has(id) ? tasksByCategories.get(id).size : 0;
      if (id === Category.ALL.id) {
        count = tasks.size;
      }
      const to = { pathname: "/tasks", query: { category: path } };
      return (
        <li className="CategoryList__item">
          <Link to={to} onClick={close} activeOnlyWhenExact>
            {({ isActive, onClick, href }) => (
              <a
                {...{ href, onClick }}
                className={`CategoryList__item-link${isActive ? "_active" : ""}`}
              >
                <span className="CategoryList__item-name">{name}</span>
                <span className="CategoryList__item-count">{count}</span>
              </a>
            )}
          </Link>
        </li>
      );
    });
  return (
    <ul className="CategoryList">
      {items}
    </ul>
  );
}
