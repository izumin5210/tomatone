/* @flow */
import React, { Component }       from "react";
import { DropTarget, DragSource } from "react-dnd";

import {
  Task,
} from "../../entities";

import TaskItemContent from "./TaskItemContent";

/* eslint-disable no-multi-spaces, react/no-unused-prop-types */
export type Props = {
  task:              Task;
  order:             number;
  check:             () => void;
  update:            (editedTask: Task) => void;
  delete:            () => void;
  select:            () => void;
  selected:          boolean;
  updateOrder:       (task: Task, dest: number) => void;
  drag:              (task: Task, dest: number) => void;
  connectDragSource: (e: any) => any;
  connectDropTarget: (e: any) => any;
  isDragging:        boolean,
  canDrop:           boolean,
};
/* eslint-enable */

const getType = (task: Task) => (task.hasCompleted() ? "completed-tasks" : "tasks");

@DropTarget(
  ({ task }: Props) => getType(task),
  {
    drop({ order, updateOrder }: Props, monitor) {
      const src = monitor.getItem();
      if (order !== src.order) {
        updateOrder(src.task, order);
      }
    },

    hover({ order, drag }: Props, monitor) {
      drag(monitor.getItem().task, order);
    },
  },
  (connect, monitor) => ({
    /* eslint-disable no-multi-spaces */
    connectDropTarget: connect.dropTarget(),
    canDrop:           monitor.canDrop(),
    /* eslint-enable */
  }),
)
@DragSource(
  ({ task }: Props) => getType(task),
  {
    beginDrag(props) {
      return props;
    },
  },
  (connect, monitor) => ({
    /* eslint-disable no-multi-spaces */
    connectDragSource: connect.dragSource(),
    isDragging:        monitor.isDragging(),
    /* eslint-enable */
  }),
)
export default class TaskItem extends Component {

  // HACK
  static defaultProps = {
    connectDragSource: () => {},
    connectDropTarget: () => {},
    isDragging:        false,
    canDrop:           false,
  };

  props: Props;

  renderInputs(ids: { completeId: string, selectId: string }) {
    const { task, check, select, selected } = this.props;

    const attrsList = [
      {
        type:      "checkbox",
        id:        ids.completeId,
        className: "TaskItem__complete",
        value:     task.id,
        checked:   task.hasCompleted(),
        onChange:  check,
      },
      {
        type:      "radio",
        id:        ids.selectId,
        className: "TaskItem__select",
        value:     task.id,
        checked:   selected,
        onChange:  select,
      },
    ];

    return attrsList.map(attrs => <input {...attrs} key={attrs.id} />);
  }

  renderIcon(ids: { completeId: string }) {
    return (
      <label htmlFor={ids.completeId} className="TaskItem__icon">
        { this.props.task.hasCompleted() && <i className="fa fa-check" /> }
      </label>
    );
  }

  renderContent(ids: { selectId: string }) {
    return (
      <label
        htmlFor={ids.selectId}
        className="TaskItem__content"
      >
        <TaskItemContent
          task={this.props.task}
          delete={this.props.delete}
          update={this.props.update}
        />
      </label>
    );
  }

  render() {
    const { task, connectDragSource, connectDropTarget, isDragging, canDrop } = this.props;
    const completeId = `TaskItem__complete_${task.id}`;
    const selectId = `TaskItem__select_${task.id}`;

    let modifier = "";
    if (isDragging) {
      modifier = canDrop ? "_dragging" : "_not-droppable";
    } else if (canDrop) {
      modifier = "_droppable";
    }

    return connectDragSource(connectDropTarget((
      <li className={`TaskItem${modifier}`}>
        { this.renderInputs({ completeId, selectId }) }
        { this.renderIcon({ completeId }) }
        { this.renderContent({ selectId }) }
      </li>
    )));
  }
}
