import React from "react";

import {
  State,
} from "../../models";

import {
  PomodoroTimer,
} from "../../components";

type Props = {
  state: State;
};

export default function TimerView({ state }: Props) {
  return (
    <div className={`TimerView_${state.isWorking() ? "work" : "break"}`}>
      <div className="TimerView__wrapper">
        <PomodoroTimer
          timer={state.timer}
          iteration={state.currentIteration()}
        />
      </div>
    </div>
  );
}
