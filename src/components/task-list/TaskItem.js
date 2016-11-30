/* @flow */
import React, { Component } from "react";

import {
  Task,
} from "../../entities";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export type Props = {
  task:     Task;
  onCheck:  () => void;
  onSelect: () => void;
  onUpdate: (editedTask: Task) => void;
  delete:   () => void;
  selected: boolean;
};

export type State = {
  editing: boolean;
  title:   string;
}
/* eslint-enable */

export default class TaskItem extends Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      editing: false,
      title:   props.task.title,
    };
  }

  state: State;

  onBtnEditClick() {
    const { editing, title } = this.state;
    const { task, onUpdate } = this.props;
    if (editing) {
      this.setState({ editing: false });
      if (title !== task.title) {
        onUpdate(task.set("title", title));
      }
    } else {
      this.setState({ editing: true });
    }
  }

  props: Props;

  get checkboxId(): string {
    return `task-${this.props.task.id}-complete`;
  }

  get radioId(): string {
    return `task-${this.props.task.id}-select`;
  }

  renderItem() {
    const { task } = this.props;
    return (
      <div className="TaskList__item">
        <label htmlFor={this.checkboxId} className="TaskList__icon">
          { task.hasCompleted() && <i className="fa fa-check" /> }
        </label>
        { this.renderBody() }
      </div>
    );
  }

  renderBody() {
    const { task } = this.props;
    const { editing } = this.state;

    const title = (
      <span className="TaskList__title">{task.title}</span>
    );

    return (
      <label htmlFor={this.radioId} className="TaskList__body">
        {editing ? this.renderEdit() : title}
        <button
          className="TaskList__btn-edit"
          onClick={() => this.onBtnEditClick()}
        >
          <i className={`fa fa-${editing ? "check" : "pencil"}`} />
        </button>
        { editing && (
          <button
            className="TaskList__btn-delete"
            onClick={() => this.props.delete()}
          >
            <i className="fa fa-trash" />
          </button>
        )}
      </label>
    );
  }

  renderEdit() {
    return (
      <form
        className="TaskList__form-edit"
        onSubmit={() => this.onBtnEditClick()}
      >
        <input
          className="TaskList__input-title"
          type="text"
          value={this.state.title}
          onChange={e => this.setState({ title: e.target.value })}
        />
      </form>
    );
  }

  render() {
    const { task, onCheck, onSelect, selected } = this.props;
    return (
      <li>
        <input
          type="radio"
          name="selected-task"
          className="TaskList__select"
          id={this.radioId}
          value={task.id}
          checked={selected}
          onChange={() => onSelect()}
        />
        <input
          type="checkbox"
          className="TaskList__complete"
          id={this.checkboxId}
          value={task.id}
          checked={task.hasCompleted()}
          onChange={() => onCheck()}
        />
        { this.renderItem() }
      </li>
    );
  }
}
