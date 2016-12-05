/* @flow */
import React, { Component } from "react";
import { dispatcher }       from "react-dispatcher-decorator";
import { Map }              from "immutable";

import {
  Task,
} from "../../entities";

import {
  State,
} from "../../models";

import {
  TasksActions,
} from "../../actions";

import {
  TaskComposer,
  TaskList,
} from "../../components";

type Props = {
  state: State;
};

@dispatcher
export default class TasksView extends Component {
  componentDidMount() {
    this.context.dispatch(TasksActions.ACTION_TASKS_GET);
  }

  getTaskListProps() {
    return {
      completeTask:   t => this.completeTask(t),
      updateTask:     t => this.updateTask(t),
      selectTask:     t => this.selectTask(t),
      deleteTask:     t => this.deleteTask(t),
      selectedTaskId: this.props.state.timer.selectedTaskId,
    };
  }

  get tasks(): Map<number, Task> {
    return this.props.state.tasks;
  }

  get activeTasks(): Map<number, Task> {
    return this.tasks.filterNot(task => task.hasCompleted());
  }

  get completedTasks(): Map<number, Task> {
    return this.tasks.filter(task => task.hasCompleted());
  }

  createTask(title: string) {
    this.context.dispatch(TasksActions.ACTION_TASK_CREATE, { title });
  }

  completeTask(task: Task) {
    if (task.hasCompleted()) {
      this.context.dispatch(TasksActions.ACTION_TASK_INCOMPLETE, { task });
    } else {
      this.context.dispatch(TasksActions.ACTION_TASK_COMPLETE, { task });
    }
  }

  selectTask(task: ?Task) {
    this.context.dispatch(TasksActions.ACTION_TASK_SELECT, { task });
  }

  updateTask(task: Task) {
    this.context.dispatch(TasksActions.ACTION_TASK_UPDATE, { task });
  }

  deleteTask(task: Task) {
    this.context.dispatch(TasksActions.ACTION_TASK_DELETE, { task });
  }

  props: Props;

  render() {
    const taskListProps = this.getTaskListProps();
    return (
      <div className="TasksView">
        <h2 className="TasksView__caption">Tasks</h2>
        <TaskList
          tasks={this.activeTasks}
          {...taskListProps}
        />
        <h2 className="TasksView__caption">Completed tasks</h2>
        <TaskList
          tasks={this.completedTasks}
          {...taskListProps}
        />
        <TaskComposer
          createTask={t => this.createTask(t)}
        />
      </div>
    );
  }
}
