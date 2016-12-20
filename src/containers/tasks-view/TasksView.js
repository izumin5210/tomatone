/* @flow */
import React, { Component } from "react";
import { dispatcher }       from "react-dispatcher-decorator";
import { Map }              from "immutable";

import {
  Category,
  Task,
} from "../../entities";

import {
  State,
} from "../../models";

import {
  TasksActions,
  CategoriesActions,
} from "../../actions";

import {
  CategorySelector,
  TaskComposer,
  TaskList,
} from "../../components";

/* eslint-disable no-multi-spaces */
type Props = {
  state:    State;
  location: any;
};
/* eslint-enable */

@dispatcher
export default class TasksView extends Component {
  componentDidMount() {
    this.context.dispatch(TasksActions.GET_ALL);
    this.context.dispatch(CategoriesActions.GET_ALL);
  }

  getTaskListProps() {
    return {
      categories:      this.props.state.categories,
      completeTask:    (t: Task) => this.completeTask(t),
      updateTask:      (t: Task) => this.updateTask(t),
      selectTask:      (t: ?Task) => this.selectTask(t),
      deleteTask:      (t: Task) => this.deleteTask(t),
      selectedTaskId:  this.props.state.timer.selectedTaskId,
      updateTaskOrder: (t: Task, dest: number) => this.updateTaskOrder(t, dest),
    };
  }

  get tasks(): Map<number, Task> {
    return this.props.state.tasks
      .filter(task => this.currentCategory.includes(task));
  }

  get activeTasks(): Map<number, Task> {
    return this.tasks.filterNot(task => task.hasCompleted());
  }

  get completedTasks(): Map<number, Task> {
    return this.tasks.filter(task => task.hasCompleted());
  }

  get currentCategory(): Category {
    const { location, state } = this.props;
    const { query } = location;
    if (query != null) {
      const category = state.categories.find(({ path }) => path === query.category);
      if (category != null) {
        return category;
      }
    }
    return Category.ALL;
  }

  createTask(title: string) {
    this.context.dispatch(TasksActions.CREATE, { title });
  }

  completeTask(task: Task) {
    if (task.hasCompleted()) {
      this.context.dispatch(TasksActions.INCOMPLETE, { task });
    } else {
      this.context.dispatch(TasksActions.COMPLETE, { task });
    }
  }

  selectTask(task: ?Task) {
    this.context.dispatch(TasksActions.SELECT, { task });
  }

  updateTask(task: Task) {
    this.context.dispatch(TasksActions.UPDATE, { task });
  }

  deleteTask(task: Task) {
    this.context.dispatch(TasksActions.DELETE, { task });
  }

  updateTaskOrder(task: Task, dest: number) {
    this.context.dispatch(TasksActions.UPDATE_ORDER, { task, order: dest });
  }

  props: Props;

  render() {
    const taskListProps = this.getTaskListProps();
    return (
      <div className="TasksView">
        <CategorySelector
          currentCategory={this.currentCategory}
          categories={this.props.state.categories}
          tasks={this.props.state.tasks}
        />
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
