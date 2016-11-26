/* @flow */
import React, { Component } from "react";
import moment from "moment";

import {
  Iteration,
} from "../../entities";

import {
  State,
} from "../../models";

type Props = {
  state: State;
};

export default class IterationList extends Component {
  static TIME_FORMAT = "YYYY/MM/DD HH:mm";

  static getFormattedDate(itr: Iteration): string {
    return moment(itr.startedAt).format(this.TIME_FORMAT);
  }

  static getTimeFrom(itr: Iteration): string {
    return moment(itr.startedAt).from(moment(itr.startedAt + itr.totalTimeInMillis), true);
  }

  static createListItem(itr: Iteration) {
    return (
      <li key={itr.id} className="IterationList__item">
        <div className={`IterationList__icon_${itr.isWorking() ? "work" : "break"}`}>
          <i className={`fa fa-${itr.type === "WORK" ? "pencil" : "coffee"}`} />
        </div>
        <div className="IterationList__body">
          <strong className="IterationList__title">
            {itr.id}: {itr.type}
          </strong>
          <div className="IterationList__metadata">
            <time>{IterationList.getFormattedDate(itr)}</time>
            &nbsp;(for {IterationList.getTimeFrom(itr)})
          </div>
        </div>
      </li>
    );
  }

  getListItems() {
    const { state } = this.props;
    return state.iterations
      .sortBy(itr => -itr.id)
      .groupBy(itr => moment(itr.startedAt).format("YYYY-MM-DD"))
      .map((itrs, date) => {
        const arr = [];
        arr.push((
          <li key={date} className="IterationList__date" >
            {date}
          </li>
        ));
        itrs.forEach((itr) => {
          arr.push(IterationList.createListItem(itr));
        });
        return arr;
      });
  }

  props: Props;

  render() {
    return (
      <ul className="IterationList">
        {this.getListItems()}
      </ul>
    );
  }
}
