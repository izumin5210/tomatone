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
  TasksActions,
} from "../../actions";

import {
  ACTION_ITERATIONS_GET,
} from "../../settings/constants";

type Props = {
  state: State;
};

@dispatcher
export default class HistoryView extends Component {
  componentDidMount() {
    this.context.dispatch(ACTION_ITERATIONS_GET);
    this.context.dispatch(TasksActions.ACTION_TASKS_GET);
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

