/* @flow */
import React, { Component } from "react";
import { Map }              from "immutable";

import {
  Task,
} from "../../entities";

import TaskItem from "./TaskItem";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type Props = {
  tasks:          Map<number, Task>;
  createTask:     (title: string) => void;
  completeTask:   (task: Task) => void;
  updateTask:     (task: Task) => void;
  selectTask:     (task: ?Task) => void;
  selectedTaskId: ?number;
};

type State = {
  title: string;
};
/* eslint-enable */

export default class TaskList extends Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      title: "",
    };
  }

  state: State;

  onTitleSubmit(e: any) {
    e.preventDefault();
    if (this.state.title.length > 0) {
      this.props.createTask(this.state.title);
      this.state.title = "";
    }
  }

  onTitleChange(e: any) {
    this.setState({ title: e.target.value });
  }

  onTaskSelect(task: Task) {
    let selectedTask = task;
    if (this.props.selectedTaskId === selectedTask.id) {
      selectedTask = undefined;
    }
    if (!task.hasCompleted()) {
      this.props.selectTask(selectedTask);
    }
  }

  getTaskItem(task: Task) {
    return (
      <TaskItem
        key={task.id}
        task={task}
        onCheck={() => this.props.completeTask(task)}
        onSelect={() => this.onTaskSelect(task)}
        onUpdate={editedTask => this.props.updateTask(editedTask)}
        selected={this.props.selectedTaskId === task.id}
      />
    );
  }

  props: Props;

  render() {
    const { tasks } = this.props;
    const items = tasks.filterNot(task => task.hasCompleted())
      .map(task => this.getTaskItem(task));
    const completedItems = tasks.filter(task => task.hasCompleted())
      .map(task => this.getTaskItem(task));
    return (
      <div className="TaskList">
        <ul className="TaskList__items">
          <li className="TaskList__item-caption">
            Tasks
          </li>
          {items}
          <li className="TaskList__item-caption">
            Completed tasks
          </li>
          {completedItems}
        </ul>
        <form onSubmit={e => this.onTitleSubmit(e)}>
          <input
            type="text"
            value={this.state.title}
            onChange={e => this.onTitleChange(e)}
          />
        </form>
      </div>
    );
  }
}
