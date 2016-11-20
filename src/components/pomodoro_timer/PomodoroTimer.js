import React, { Component, PropTypes } from "react";
import { dispatcher } from "react-dispatcher-decorator";
import moment         from "moment";

import {
  IterationType,
  TimerType,
} from "../../entities";

import {
  ACTION_TIMER_START,
  ACTION_TIMER_STOP,
} from "../../settings/constants";

import tickingSound from "../../assets/audios/ticking.mp3";
import finishSound  from "../../assets/audios/finish.mp3";

import TimerInner from "./TimerInner";

@dispatcher
export default class PomodoroTimer extends Component {
  static propTypes = {
    timer: PropTypes.instanceOf(TimerType).isRequired,
    iterations: PropTypes.arrayOf(
      PropTypes.instanceOf(IterationType),
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      intervalId: undefined,
      remainTimeInMillis: 0,
    };
  }

  componentDidMount() {
    this.checkUpdates(this.props, this.state);
  }

  componentWillUpdate(props, state) {
    this.checkUpdates(props, state);
  }

  componentWillUnmount() {
    if (this.state.intervalId !== undefined) {
      clearInterval(this.state.intervalId);
    }
  }

  onBtnPlayClick() {
    if (this.hasStarted) {
      this.stop();
    }
    this.context.dispatch(this.hasStarted ? ACTION_TIMER_STOP : ACTION_TIMER_START);
  }

  checkUpdates(props, state) {
    const { timer, iterations } = props;
    const currentItr = iterations.find(v => v.id === timer.currentIterationId);
    if (state.intervalId === undefined && currentItr !== undefined) {
      const intervalId = setInterval(() => this.refresh(), 1000);
      this.setState({ intervalId });
    }
  }

  refresh() {
    const { timer, iterations } = this.props;
    const itr = iterations.find(v => v.id === timer.currentIterationId);
    if (itr !== undefined) {
      if (this.isWorking) {
        this.tickingSoundEl.play();
      }
      const stoppedAt = moment(itr.startedAt).add(itr.totalTimeInMillis, "ms");
      if (stoppedAt.isBefore()) {
        this.finishSoundEl.play();
        this.stop();
      } else {
        const duration = moment.duration(stoppedAt - moment());
        this.setState({ remainTimeInMillis: duration.asMilliseconds() });
      }
    }
  }

  stop() {
    if (this.state.intervalId !== undefined) {
      clearInterval(this.state.intervalId);
    }
    this.setState({
      intervalId: undefined,
      remainTimeInMillis: 0,
    });
  }

  get currentIteration() {
    const { timer, iterations } = this.props;
    return iterations.find(v => v.id === timer.currentIterationId);
  }

  get hasStarted() {
    return this.props.timer && (this.props.timer.currentIterationId !== undefined);
  }

  get isWorking() {
    return this.hasStarted && this.currentIteration.isWorking;
  }

  get totalTimeInMillis() {
    return this.hasStarted ? this.currentIteration.totalTimeInMillis : 0;
  }

  get name() {
    let name = "";
    if (this.hasStarted) {
      name = this.hasStarted && `${this.currentIteration.state}(${this.currentIteration.count})`;
    }
    return name;
  }

  get gradients() {
    // FIXME: Should import from settings/constans.css
    const colorText = "#f9f9f9";
    const bg = this.isWorking ? "#a54c38" : "#5f8e58";

    const r = this.hasStarted ? (1 - (this.state.remainTimeInMillis / this.totalTimeInMillis)) : 0;
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

  render() {
    return (
      <div
        className="PomodoroTimer"
        style={{
          backgroundImage: this.gradients.join(", "),
        }}
      >
        <TimerInner
          name={this.name}
          hasStarted={this.hasStarted}
          isWorking={this.isWorking}
          remainTimeInMillis={this.state.remainTimeInMillis}
          onBtnPlayClick={() => this.onBtnPlayClick()}
        />
        <audio
          src={tickingSound}
          ref={(ref) => { this.tickingSoundEl = ref; }}
        />
        <audio
          src={finishSound}
          ref={(ref) => { this.finishSoundEl = ref; }}
        />
      </div>
    );
  }
}
