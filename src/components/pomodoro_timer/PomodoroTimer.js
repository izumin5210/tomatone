/* @flow */
import React, { Component } from "react";
import { dispatcher } from "react-dispatcher-decorator";

import {
  Iteration,
} from "../../entities";

import {
  ACTION_TIMER_START,
  ACTION_TIMER_STOP,
} from "../../settings/constants";

/*
 * FIXME
 * import tickingSound from "../../assets/audios/ticking.mp3";
 * import finishSound  from "../../assets/audios/finish.mp3";
 */

import TimerInner from "./TimerInner";

type Props = {
  iteration: ?Iteration;
};

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type State = {
  intervalId:         ?number;
  remainTimeInMillis: number;
};
/* eslint-enable */

const initialState: State = {
  intervalId:         undefined,
  remainTimeInMillis: 0,
};

@dispatcher
export default class PomodoroTimer extends Component {

  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  state: State;

  componentDidMount() {
    this.checkUpdates(this.props, this.state);
  }

  componentWillUpdate(props: Props, state: State) {
    this.checkUpdates(props, state);
  }

  componentWillUnmount() {
    if (this.state.intervalId != null) {
      clearInterval(this.state.intervalId);
    }
  }

  onBtnPlayClick() {
    if (this.hasStarted()) {
      this.stop();
    }
    this.context.dispatch(this.hasStarted() ? ACTION_TIMER_STOP : ACTION_TIMER_START);
  }

  getGradients(): Array<string> {
    // FIXME: Should import from settings/constans.css
    const colorText = "#f9f9f9";
    const bg = this.isWorking() ? "#a54c38" : "#5f8e58";

    const itr = this.props.iteration;
    const r = (itr != null) ? (1 - (this.state.remainTimeInMillis / itr.totalTimeInMillis())) : 0;
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

  checkUpdates(props: Props, state: State) {
    const itr = props.iteration;
    if (state.intervalId == null && itr != null && !itr.isFinished()) {
      const intervalId = setInterval(() => this.refresh(), 1000);
      const remainTimeInMillis = itr.totalTimeInMillis();
      this.setState({ intervalId, remainTimeInMillis });
    }
  }

  refresh() {
    const itr = this.props.iteration;
    if (itr != null) {
      if (itr.isWorking()) {
        /*
         * FIXME
         * this.tickingSoundEl.play();
         */
      }
      this.setState({ remainTimeInMillis: itr.remainTimeInMillis() });
      if (itr.isFinished()) {
        /*
         * FIXME
         * this.finishSoundEl.play();
         */
        this.stop();
        this.context.dispatch(ACTION_TIMER_START);
      }
    }
  }

  stop() {
    if (this.state.intervalId != null) {
      clearInterval(this.state.intervalId);
      this.setState(initialState);
    }
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
    return (itr != null) ? itr.totalTimeInMillis() : 0;
  }

  name(): string {
    const itr = this.props.iteration;
    return (itr != null) ? `${itr.state}(${itr.count})` : "";
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
          remainTimeInMillis={this.state.remainTimeInMillis}
          onBtnPlayClick={() => this.onBtnPlayClick()}
        />
        {
        /*
         * FIXME: Should use WebAudio API
         * <audio
         *   src={tickingSound}
         *   ref={(ref) => { this.tickingSoundEl = ref; }}
         * />
         * <audio
         *   src={finishSound}
         *   ref={(ref) => { this.finishSoundEl = ref; }}
         * />
         */
        }
      </div>
    );
  }
}
