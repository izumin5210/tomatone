/* @flow */
import React, { Component } from "react";

import {
  Task,
} from "../../entities";

import TaskItemContent from "./TaskItemContent";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export type Props = {
  task:      Task;
  check:     () => void;
  update:   (editedTask: Task) => void;
  delete:   () => void;
  select:   () => void;
  selected: boolean;
};
/* eslint-enable */


export default class TaskItem extends Component {

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
    const { task } = this.props;
    const completeId = `TaskItem__complete_${task.id}`;
    const selectId = `TaskItem__select_${task.id}`;

    return (
      <li className="TaskItem">
        { this.renderInputs({ completeId, selectId }) }
        { this.renderIcon({ completeId }) }
        { this.renderContent({ selectId }) }
      </li>
    );
  }
}
