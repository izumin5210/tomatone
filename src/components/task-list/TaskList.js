/* @flow */
import React, { Component } from "react";
import { DragDropContext }  from "react-dnd";
import ReactDndHtml5Backend from "react-dnd-html5-backend";
import { List, Map }        from "immutable";

import assert from "power-assert"; // eslint-disable-line

import { Category }  from "../../entities";
import type { Task } from "../../entities"; // eslint-disable-line

import TaskItem from "./TaskItem";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type Props = {
  tasks:           Map<number, Task>;
  categories:      Map<number, Category>;
  completeTask:    (task: Task) => void;
  updateTask:      (task: Task) => void;
  selectTask:      (task: ?Task) => void;
  deleteTask:      (task: Task) => void;
  selectedTaskId?: number;
  updateTaskOrder: (task: Task, dest: number) => void;
};

type State = {
  orders: List<number>;
};
/* eslint-enable */

@DragDropContext(ReactDndHtml5Backend)
export default class TaskList extends Component {

  static getInitialOrders({ tasks }: Props): List<number> {
    return tasks.sortBy(t => t.order).map(t => t.id).toList();
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      orders: TaskList.getInitialOrders(props),
    };
  }

  state: State;

  componentWillReceiveProps(props: Props) {
    const orders = TaskList.getInitialOrders(props);
    this.setState({ orders });
  }

  componentWillUnmount() {
    if (this.requestedFrame != null) {
      cancelAnimationFrame(this.requestedFrame);
    }
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

  onDrag(task: Task, dest: number) {
    if (this.state.orders.get(task.id) === dest) {
      return;
    }
    this.scheduleUpdate(() => {
      assert(this.state.orders.get(task.id) !== dest);
      const src = this.state.orders.indexOf(task.id);
      const orders = this.state.orders
        .delete(src)
        .insert(dest + (dest > src ? 1 : 0), task.id);
      return { orders };
    });
  }

  onDrop(task: Task, dest: number) {
    if (task.order !== dest) {
      this.props.updateTaskOrder(task, dest);
    }
  }

  getTaskItem(task: Task, order: number) {
    const { categories } = this.props;
    const category = categories.get(task.categoryId, Category.NO_CATEGORY);
    return (
      <TaskItem
        key={task.id}
        {...{ task, category, categories, order }}
        check={() => this.props.completeTask(task)}
        update={editedTask => this.props.updateTask(editedTask)}
        delete={() => this.props.deleteTask(task)}
        select={() => this.onTaskSelect(task)}
        selected={this.props.selectedTaskId === task.id}
        drag={(t: Task, o: number) => this.onDrag(t, o)}
        drop={(t: Task, o: number) => this.onDrop(t, o)}
      />
    );
  }

  scheduleUpdate(updateFn: () => State) {
    this.pendingUpdateFn = updateFn;
    if (!this.requestedFrame) {
      this.requestedFrame = requestAnimationFrame(() => this.drawFrame());
    }
  }

  drawFrame() {
    if (this.pendingUpdateFn != null) {
      this.setState(this.pendingUpdateFn());
    }

    this.pendingUpdateFn = null;
    this.requestedFrame = null;
  }

  props: Props;
  pendingUpdateFn: ?() => State;
  requestedFrame: ?number;

  render() {
    const items = this.state.orders
      .map((id, i) => this.getTaskItem(this.props.tasks.get(id), i));
    return (
      <div className="TaskList">
        <ul className="TaskList__items">
          {items}
        </ul>
      </div>
    );
  }
}
