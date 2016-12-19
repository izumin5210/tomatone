/* @flow */
import React, { Component } from "react";
import { Map }              from "immutable";

import {
  Category,
  Task,
} from "../../entities";

import CategoryBreadcrumbs from "./CategoryBreadcrumbs";
import CategoryList        from "./CategoryList";

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

  props: Props;

  render() {
    const { currentCategory, categories, tasks } = this.props;
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
          <CategoryBreadcrumbs
            {...{ currentCategory, categories }}
          />
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
