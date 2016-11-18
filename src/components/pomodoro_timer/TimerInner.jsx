import React, { Component, PropTypes } from "react";
import moment from "moment";

import BtnStart from "./BtnStart";

export default class TimerInner extends Component {
  static propTypes = {
    name: PropTypes.string,
    hasStarted: PropTypes.bool.isRequired,
    isWorking: PropTypes.bool.isRequired,
    remainTimeInMillis: PropTypes.number.isRequired,
    onBtnPlayClick: PropTypes.func.isRequired,
  };

  get remainTime() {
    return moment(this.props.remainTimeInMillis).format("mm:ss");
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
          {this.remainTime}
        </span>
        <BtnStart
          {...{ hasStarted, modifier }}
          onClick={() => onBtnPlayClick()}
        />
      </div>
    );
  }
}
