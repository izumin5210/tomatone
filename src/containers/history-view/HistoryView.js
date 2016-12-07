/* @flow */
import React, { Component } from "react";
import { dispatcher }       from "react-dispatcher-decorator";

import {
  State,
} from "../../models";

import {
  IterationList,
} from "../../components";

import {
  IterationsActions,
  TasksActions,
} from "../../actions";

type Props = {
  state: State;
};

@dispatcher
export default class HistoryView extends Component {
  componentDidMount() {
    this.context.dispatch(IterationsActions.GET_ALL);
    this.context.dispatch(TasksActions.GET_ALL);
  }

  props: Props;

  render() {
    const { iterations, tasks } = this.props.state;
    return (
      <div className="HistoryView">
        <IterationList
          {...{ iterations, tasks }}
        />
      </div>
    );
  }
}

