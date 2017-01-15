/* @flow */
import React, { Component } from "react";

import type { Map } from "immutable";

import CategoryPath from "../category-path";
import TaskItemButton from "./TaskItemButton";

import type {
  Category,
  Task,
} from "../../entities";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export type Props = {
  task:       Task;
  category:   Category;
  categories: Map<number, Category>;
  update:     (editedTask: Task) => void;
  delete:     () => void;
};

export type State = {
  editing: boolean;
  title:   string;
}
/* eslint-enable */

export default class TaskItemContent extends Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      editing: false,
      title:   this.defaultTitle,
    };
  }

  state: State;

  onBtnEditClick(e: any) {
    e.preventDefault();
    const { editing, title } = this.state;
    const { task, update } = this.props;
    if (editing) {
      this.setState({ editing: false });
      if (title !== this.defaultTitle) {
        update(task.set("title", title));
      }
    } else {
      this.setState({ editing: true });
    }
  }

  onBtnClearClick(e: any) {
    e.preventDefault();
    this.setState({
      editing: false,
      title:   this.defaultTitle,
    });
  }

  get defaultTitle(): string {
    const { category, task } = this.props;
    return category.isMeta ? task.title : `${category.name}/${task.title}`;
  }

  props: Props;

  renderEdit() {
    return (
      <form
        className="TaskItemContent__form-edit"
        onSubmit={e => this.onBtnEditClick(e)}
      >
        <input
          className="TaskItemContent__input-title"
          type="text"
          value={this.state.title}
          onChange={e => this.setState({ title: e.target.value })}
        />
      </form>
    );
  }

  renderButtons() {
    const { editing } = this.state;
    const getId = (name: string) => `TaskItemContent__button-${name}`;

    const attrsList = [
      {
        id:      getId("edit"),
        icon:    editing ? "check" : "pencil",
        visible: true,
        onClick: (e: any) => this.onBtnEditClick(e),
      },
      {
        id:      getId("clear"),
        icon:    "times",
        visible: editing,
        onClick: (e: any) => this.onBtnClearClick(e),
      },
      {
        id:      getId("delete"),
        icon:    "trash",
        visible: editing,
        onClick: () => this.props.delete(),
      },
    ];

    return attrsList.map(attrs => <TaskItemButton {...attrs} key={attrs.id} />);
  }

  render() {
    const { editing } = this.state;
    const { task, category, categories } = this.props;

    const title = (
      <div className="TaskItemContent__heading">
        { !category.isMeta &&
          <CategoryPath
            {...{ category, categories }}
          />
        }
        <h3 className="TaskItemContent__title">{task.title}</h3>
      </div>
    );

    return (
      <div className="TaskItemContent" >
        {editing ? this.renderEdit() : title}
        {this.renderButtons()}
      </div>
    );
  }
}
