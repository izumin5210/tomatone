/* @flow */
import React, { Component } from "react";
import moment from "moment";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type Props = {
  title:             string;
  startedAt:         number;
  totalTimeInMillis: number;
  working:           boolean;
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
    const { working } = this.props;
    return (
      <div className={`IterationList__icon_${working ? "work" : "break"}`}>
        <i className={`fa fa-${working ? "pencil" : "coffee"}`} />
      </div>
    );
  }

  renderBody() {
    const { title, startedAt, totalTimeInMillis } = this.props;
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
