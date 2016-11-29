/* @flow */
import React, { Component } from "react";

import {
  Iteration,
  Timer,
} from "../../entities";

import TimerInner from "./TimerInner";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type Props = {
  iteration:      ?Iteration;
  timer:          Timer;
  onBtnPlayClick: () => void;
};
/* eslint-enable */

export default class PomodoroTimer extends Component {

  getGradients(): Array<string> {
    // FIXME: Should import from settings/constans.css
    const colorText = "#f9f9f9";
    const bg = this.isWorking() ? "#a54c38" : "#5f8e58";

    const { timer } = this.props;
    const r = timer.hasStarted() ? (1 - (timer.remainTimeInMillis / timer.totalTimeInMillis)) : 0;
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

  isWorking(): boolean {
    const itr = this.props.iteration;
    return (itr != null) && itr.isWorking();
  }

  name(): string {
    const itr = this.props.iteration;
    return (itr != null) ? `${itr.type}(${itr.numOfIteration})` : "";
  }

  props: Props;

  render() {
    const { timer, onBtnPlayClick } = this.props;
    return (
      <div
        className="PomodoroTimer"
        style={{
          backgroundImage: this.getGradients().join(", "),
        }}
      >
        <TimerInner
          name={this.name()}
          hasStarted={timer.hasStarted()}
          isWorking={this.isWorking()}
          remainTimeInMillis={timer.remainTimeInMillis}
          onBtnPlayClick={() => onBtnPlayClick()}
        />
      </div>
    );
  }
}
