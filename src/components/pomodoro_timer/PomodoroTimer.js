/* @flow */
import React, { Component } from "react";
import { dispatcher } from "react-dispatcher-decorator";

import {
  Iteration,
} from "../../entities";

import {
  SoundPlayer,
} from "../../models";

import {
  TICKING_SOUND_URI,
  FINISH_SOUND_URI,
} from "../../settings/audio";

import {
  ACTION_TIMER_START,
  ACTION_TIMER_STOP,
} from "../../settings/constants";

import TimerInner from "./TimerInner";

type Props = {
  iteration: ?Iteration;
};

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type State = {
  intervalId:         ?number;
  remainTimeInMillis: number;
  soundLoaded:        boolean;
  tickingSoundPlayer: SoundPlayer;
  finishSoundPlayer:  SoundPlayer;
};
/* eslint-enable */

const initialState: State = {
  intervalId:         undefined,
  remainTimeInMillis: 0,
  soundLoaded:        false,
  tickingSoundPlayer: new SoundPlayer(TICKING_SOUND_URI),
  finishSoundPlayer:  new SoundPlayer(FINISH_SOUND_URI),
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
    const promise = Promise.all([
      this.state.tickingSoundPlayer.fetch(),
      this.state.finishSoundPlayer.fetch(),
    ]);
    promise.then(() => this.setState({ soundLoaded: true }));
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
    const r = (itr != null) ? (1 - (this.state.remainTimeInMillis / itr.totalTimeInMillis)) : 0;
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
      const remainTimeInMillis = itr.totalTimeInMillis;
      this.setState({ intervalId, remainTimeInMillis });
    }
  }

  refresh() {
    const itr = this.props.iteration;
    if (itr != null) {
      if (itr.isWorking()) {
        this.state.tickingSoundPlayer.play();
      }
      this.setState({ remainTimeInMillis: itr.remainTimeInMillis() });
      if (itr.isFinished()) {
        this.state.finishSoundPlayer.play();
        this.stop();
        this.context.dispatch(ACTION_TIMER_START);
      }
    }
  }

  stop() {
    if (this.state.intervalId != null) {
      clearInterval(this.state.intervalId);
      this.setState({ intervalId: undefined, remainTimeInMillis: 0 });
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
          remainTimeInMillis={this.state.remainTimeInMillis}
          onBtnPlayClick={() => this.onBtnPlayClick()}
        />
      </div>
    );
  }
}
