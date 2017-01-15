/* @flow */
import React, { Component } from "react";
import { Link }             from "react-router";

import type {
  Category,
} from "../../entities";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export type Props = {
  currentCategory: Category;
  category:        Category;
  taskCount:       number;
  close:           () => void;
  children?:       ?React$Element<*>;
};

type State = {
  opened: boolean;
};
/* eslint-enable */

export default class CategoryNode extends Component {

  static isLinkActive({ query }, props): boolean {
    if (query == null) {
      return props.query.category == null;
    }
    return query.category === props.query.category;
  }

  constructor(props: Props) {
    super(props);
    const { currentCategory, category } = props;
    this.state = {
      opened: category.isParentOf(currentCategory) || (category.id === currentCategory.id),
    };
  }

  state: State;

  onLinkClicked() {
    if (this.hasChildCategories) {
      this.setState({ opened: !this.state.opened });
    } else {
      this.props.close();
    }
  }

  get hasChildCategories(): boolean {
    return this.props.children != null;
  }

  get shouldRenderChildList(): boolean {
    return this.state.opened && this.hasChildCategories;
  }

  props: Props

  renderLink({ isActive, onClick, href }: any) {
    const { category, taskCount } = this.props;
    const { subName, depth } = category;
    let modifier = "";
    if (this.hasChildCategories) {
      modifier = `_${this.state.opened ? "opened" : "closed"}`;
    }
    return (
      <a
        {...{ href, onClick }}
        className={`CategoryNode__link${isActive ? "_active" : ""}`}
        style={{
          // FIXME
          paddingLeft: `${16 + (Math.max(depth - 2, 0) * 16)}px`,
        }}
      >
        <span className={`CategoryNode__name${modifier}`}>
          {subName}
        </span>
        <span className="CategoryNode__count">{taskCount}</span>
      </a>
    );
  }

  render() {
    const { category, children } = this.props;

    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <li
        className="CategoryNode"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Link
          to={{ query: { category: category.path } }}
          onClick={e => this.onLinkClicked(e)}
          isActive={(location, props) => CategoryNode.isLinkActive(location, props)}
        >
          {props => this.renderLink(props)}
        </Link>
        { this.state.opened && children }
      </li>
    );
    /* eslint-enable */
  }
}
