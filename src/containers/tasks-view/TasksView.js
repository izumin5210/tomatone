/* @flow */
import React, { Component } from "react";
import { dispatcher }       from "react-dispatcher-decorator";

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

  props: Props;

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

  render() {
    return (
      <div className="TasksView">
        <TaskList
          tasks={this.props.state.tasks}
          completeTask={t => this.completeTask(t)}
          updateTask={t => this.updateTask(t)}
          selectTask={t => this.selectTask(t)}
          deleteTask={t => this.deleteTask(t)}
          selectedTaskId={this.props.state.timer.selectedTaskId}
        />
        <TaskComposer
          createTask={t => this.createTask(t)}
        />
      </div>
    );
  }
}
