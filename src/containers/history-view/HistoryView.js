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
  ACTION_ITERATIONS_GET,
} from "../../settings/constants";

type Props = {
  state: State;
};

@dispatcher
export default class HistoryView extends Component {
  componentDidMount() {
    this.context.dispatch(ACTION_ITERATIONS_GET);
  }

  props: Props;

  render() {
    return (
      <div className="HistoryView">
        <IterationList state={this.props.state} />
      </div>
    );
  }
}

