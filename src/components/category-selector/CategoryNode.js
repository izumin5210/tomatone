/* @flow */
import React, { Component } from "react";
import { Link }             from "react-router";
import { Map }              from "immutable";

import {
  Category,
} from "../../entities";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export type Props = {
  currentCategory: Category;
  category:        Category;
  taskCounts:      Map<number, number>;
  close:           () => void;
  children?:       ?React$Element<*>;
};

type State = {
  opened: boolean;
};
/* eslint-enable */

export default class CategoryNode extends Component {
  constructor(props: Props) {
    super(props);
    const { currentCategory, category } = props;
    this.state = {
      opened: category.isParentOf(currentCategory) || (category.id === currentCategory.id),
    };
  }

  state: State;
  props: Props

  get hasChildCategories(): boolean {
    return this.props.children != null;
  }

  get shouldRenderChildList(): boolean {
    return this.state.opened && this.hasChildCategories;
  }

  render() {
    const { category, taskCounts, close, children } = this.props;
    const { path, subName } = category;
    const { opened } = this.state;
    const to = { pathname: "/tasks", query: { category: path } };
    let modifier = "";
    if (this.hasChildCategories) {
      modifier = `_${opened ? "opened" : "closed"}`;
    }

    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <li
        className="CategoryNode"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Link
          to={to}
          onClick={() => {
            if (this.hasChildCategories) {
              this.setState({ opened: !opened });
            } else {
              close();
            }
          }}
        >
          {({ isActive, onClick, href }) => (
            <a
              {...{ href, onClick }}
              className={`CategoryNode__link${isActive ? "_active" : ""}`}
              style={{
                // FIXME
                paddingLeft: `${16 + (Math.max(category.depth - 2, 0) * 16)}px`,
              }}
            >
              <span className={`CategoryNode__name${modifier}`}>
                {subName}
              </span>
              <span className="CategoryNode__count">{taskCounts.get(category.id, 0)}</span>
            </a>
          )}
        </Link>
        { opened && children }
      </li>
    );
    /* eslint-enable */
  }
}
