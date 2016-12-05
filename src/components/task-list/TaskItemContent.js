/* @flow */
import React, { Component } from "react";

import {
  Task,
} from "../../entities";

import TaskItemButton from "./TaskItemButton";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export type Props = {
  task:     Task;
  update:   (editedTask: Task) => void;
  delete:   () => void;
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
      title:   this.props.task.title,
    };
  }

  state: State;

  onBtnEditClick(e: any) {
    e.preventDefault();
    const { editing, title } = this.state;
    const { task, update } = this.props;
    if (editing) {
      this.setState({ editing: false });
      if (title !== task.title) {
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
      title:   this.props.task.title,
    });
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
    const { task } = this.props;

    const title = (
      <span className="TaskItemContent__title">{task.title}</span>
    );

    return (
      <div className="TaskItemContent" >
        {editing ? this.renderEdit() : title}
        {this.renderButtons()}
      </div>
    );
  }
}