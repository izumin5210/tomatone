/* @flow */
import React, { Component } from "react";
import moment               from "moment";
import { Map }              from "immutable";

import IterationItem from "./IterationItem";

import type {
  Iteration,
  Task,
} from "../../entities";

/* eslint-disable no-multi-spaces */
type Props = {
  iterations:      Map<number, Iteration>;
  tasks:           Map<number, Task>;
};
/* eslint-enable */

export default class IterationList extends Component {

  getListItems() {
    const { iterations, tasks } = this.props;
    return iterations
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
          arr.push((
            <IterationItem
              iteration={itr}
              task={tasks.get(itr.taskId)}
            />
          ));
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
