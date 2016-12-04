/* @flow */
import React, { Component } from "react";
import moment from "moment";

import {
  Iteration,
  Task,
} from "../../entities";

/* eslint-disable no-multi-spaces */
type Props = {
   iteration: Iteration;
   task:      Task;
};
/* eslint-enable */

export default class IterationItem extends Component {
  static TIME_FORMAT = "YYYY/MM/DD HH:mm";

  static getFormattedDate(startedAt: number): string {
    return moment(startedAt).format(this.TIME_FORMAT);
  }

  static getTimeFrom(ms: number): string {
    return moment.duration(ms, "ms").humanize();
  }

  props: Props;

  renderIcon() {
    const { working } = this.props.iteration.isWorking();
    return (
      <div className={`IterationList__icon_${working ? "work" : "break"}`}>
        <i className={`fa fa-${working ? "pencil" : "coffee"}`} />
      </div>
    );
  }

  renderBody() {
    const { iteration, task } = this.props;
    const { startedAt, totalTimeInMillis, type } = iteration;
    const title = (task != null) ? task.title : type;
    return (
      <div className="IterationList__body">
        <strong className="IterationList__title">
          { title }
        </strong>
        <div className="IterationList__metadata">
          <time>{IterationItem.getFormattedDate(startedAt)}</time>
          &nbsp;(for {IterationItem.getTimeFrom(totalTimeInMillis)})
        </div>
      </div>
    );
  }

  render() {
    return (
      <li className="IterationList__item">
        { this.renderIcon() }
        { this.renderBody() }
      </li>
    );
  }
}
