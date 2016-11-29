/* @flow */
import React, { Component } from "react";

import BtnStart from "./BtnStart";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type Props = {
  name:               string;
  hasStarted:         boolean;
  isWorking:          boolean;
  remainTimeInMillis: number;
  onBtnPlayClick:     () => void;
};
/* eslint-enable */

export default class TimerInner extends Component {

  props: Props;

  remainTime(): string {
    const { remainTimeInMillis } = this.props;
    const s = ((remainTimeInMillis < 0) ? 0 : remainTimeInMillis) / 1000;
    const min = Math.floor(s / 60);
    const sec = Math.round(s) % 60;
    return `${min}:${(`00${sec}`).slice(-2)}`;
  }

  render() {
    const { name, hasStarted, isWorking, onBtnPlayClick } = this.props;
    const modifier = hasStarted ? `_${isWorking ? "work" : "break"}ing` : "";
    return (
      <div className={`PomodoroTimer__inner-wrapper${modifier}`}>
        <h2 className="PomodoroTimer__name">
          {name}
        </h2>
        <span className="PomodoroTimer__time">
          {this.remainTime()}
        </span>
        <BtnStart
          {...{ hasStarted, modifier }}
          onClick={() => onBtnPlayClick()}
        />
      </div>
    );
  }
}
