/* @flow */
import React, { Component } from "react";
import { dispatcher } from "react-dispatcher-decorator";

import {
  Iteration,
  Timer,
} from "../../entities";

import {
  ACTION_TIMER_START,
  ACTION_TIMER_STOP,
} from "../../settings/constants";

import TimerInner from "./TimerInner";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type Props = {
  iteration: ?Iteration;
  timer:     Timer;
};
/* eslint-enable */

@dispatcher
export default class PomodoroTimer extends Component {

  onBtnPlayClick() {
    this.context.dispatch(this.hasStarted() ? ACTION_TIMER_STOP : ACTION_TIMER_START);
  }

  getGradients(): Array<string> {
    // FIXME: Should import from settings/constans.css
    const colorText = "#f9f9f9";
    const bg = this.isWorking() ? "#a54c38" : "#5f8e58";

    const { timer } = this.props;
    const itr = this.props.iteration;
    const r = (itr != null) ? (1 - (timer.remainTimeInMillis / itr.totalTimeInMillis)) : 0;
    if (r < 0.5) {
      const angle = ((r / 0.5) * 180) + 90;
      return [
        `linear-gradient(${angle}deg, transparent 50%, ${bg} 50%)`,
        `linear-gradient(90deg, ${bg} 50%, transparent 50%)`,
      ];
    }

    const angle = (((r - 0.5) / 0.5) * 180) + 90;
    return [
      `linear-gradient(${angle}deg, transparent 50%, ${colorText} 50%)`,
      `linear-gradient(90deg, ${bg} 50%, transparent 50%)`,
    ];
  }

  hasStarted(): boolean {
    return this.props.iteration != null;
  }

  isWorking(): boolean {
    const itr = this.props.iteration;
    return (itr != null) && itr.isWorking();
  }

  totalTimeInMillis(): number {
    const itr = this.props.iteration;
    return (itr != null) ? itr.totalTimeInMillis : 0;
  }

  name(): string {
    const itr = this.props.iteration;
    return (itr != null) ? `${itr.type}(${itr.numOfIteration})` : "";
  }

  props: Props;

  render() {
    return (
      <div
        className="PomodoroTimer"
        style={{
          backgroundImage: this.getGradients().join(", "),
        }}
      >
        <TimerInner
          name={this.name()}
          hasStarted={this.hasStarted()}
          isWorking={this.isWorking()}
          remainTimeInMillis={this.props.timer.remainTimeInMillis}
          onBtnPlayClick={() => this.onBtnPlayClick()}
        />
      </div>
    );
  }
}
