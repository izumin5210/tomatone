/* @flow */
import React, { Component } from "react";
import { dispatcher }       from "react-dispatcher-decorator";

import {
  State,
} from "../../models";

import {
  Timer,
} from "../../entities";

import {
  PomodoroTimer,
} from "../../components";

import {
  ACTION_TIMER_START,
  ACTION_TIMER_STOP,
} from "../../settings/constants";

type Props = {
  state: State;
};

@dispatcher
export default class TimerView extends Component {
  onBtnPlayClick() {
    this.context.dispatch(this.timer.hasStarted() ? ACTION_TIMER_STOP : ACTION_TIMER_START);
  }

  props: Props;

  get timer(): Timer {
    return this.props.state.timer;
  }

  render() {
    const { state } = this.props;
    return (
      <div className={`TimerView_${state.isWorking() ? "work" : "break"}`}>
        <div className="TimerView__wrapper">
          <PomodoroTimer
            timer={this.timer}
            iteration={state.currentIteration()}
            onBtnPlayClick={() => this.onBtnPlayClick()}
          />
        </div>
      </div>
    );
  }
}
