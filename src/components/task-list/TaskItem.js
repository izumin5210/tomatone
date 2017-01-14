/* @flow */
import React, { Component }       from "react";
import { DropTarget, DragSource } from "react-dnd";

import type { Map } from "immutable";

import TaskItemContent from "./TaskItemContent";

import type {
  Category,
  Task,
} from "../../entities";

/* eslint-disable no-multi-spaces, react/no-unused-prop-types */
export type Props = {
  task:              Task;
  category:          Category;
  categories:        Map<number, Category>;
  order:             number;
  check:             () => void;
  update:            (editedTask: Task) => void;
  delete:            () => void;
  select:            () => void;
  selected:          boolean;
  drag:              (task: Task, dest: number) => void;
  drop:              (task: Task, dest: number) => void;
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
    drop({ order, drop }: Props, monitor) {
      drop(monitor.getItem().task, order);
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
          category={this.props.category}
          categories={this.props.categories}
          delete={this.props.delete}
          update={this.props.update}
        />
      </label>
    );
  }

  render() {
    const { task, selected } = this.props;
    const { connectDragSource, connectDropTarget, isDragging, canDrop } = this.props;
    const completeId = `TaskItem__complete_${task.id}`;
    const selectId = `TaskItem__select_${task.id}`;

    let modifier = "";
    if (isDragging) {
      modifier = canDrop ? "_dragging" : "_not-droppable";
    } else if (canDrop) {
      modifier = "_droppable";
    } else if (selected) {
      modifier = "_selected";
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
