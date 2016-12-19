/* @flow */
import React, { Component } from "react";
import { Link }             from "react-router";
import { Map }              from "immutable";

import {
  Category,
  Task,
} from "../../entities";

import CategoryList from "./CategoryList";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type Props = {
  currentCategory: Category;
  categories:      Map<number, Category>;
  tasks:           Map<number, Task>;
};

type State = {
  opened: boolean;
};
/* eslint-enable */

export default class CategorySelector extends Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      opened: false,
    };
  }

  state: State;

  setOpened(opened: boolean) {
    this.setState({ opened });
  }

  get categoryPaths(): Map<number, Category> {
    const { currentCategory, categories } = this.props;
    return categories
      .filter(cat => cat.isParentOf(currentCategory) || (cat.id === currentCategory.id))
      .sortBy(cat => cat.depth);
  }

  props: Props;

  render() {
    const { categories, tasks } = this.props;
    if (categories.size < 2) { return null; }

    const path = this.categoryPaths.map(cat => (
      <li key={`category-${cat.id}`} className="CategorySelector__breadcrumbs-item">
        <Link to={{ pathname: "/tasks", query: { category: cat.name } }}>
          {cat.subName}
        </Link>
      </li>
    ));

    const { opened } = this.state;
    const modifier = opened ? "_opened" : "";
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <div
        className={`CategorySelector${modifier}`}
        onClick={() => {
          if (opened) { this.setOpened(false); }
        }}
      >
        <button
          className={`CategorySelector__button-open${modifier}`}
          onClick={() => this.setOpened(!opened)}
        >
          <ul className="CategorySelector__breadcrumbs">
            {path}
          </ul>
        </button>
        { opened && <CategoryList
          {...{ categories, tasks }}
          close={() => this.setOpened(false)}
        /> }
      </div>
    );
    /* eslint-enable */
  }
}
