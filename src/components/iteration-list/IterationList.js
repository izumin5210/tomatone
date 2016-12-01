/* @flow */
import React, { Component } from "react";
import moment from "moment";

import IterationItem from "./IterationItem";

import {
  State,
} from "../../models";

type Props = {
  state: State;
};

export default class IterationList extends Component {

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
          arr.push((
            <IterationItem
              title={`${itr.id}: ${itr.type}`}
              startedAt={itr.startedAt}
              totalTimeInMillis={itr.totalTimeInMillis}
              working={itr.isWorking()}
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
