/* @flow */
import React, { Component } from 'react'

import {
  Iteration,
  Timer,
} from '../../entities'

import TimerWrapper from './TimerWrapper'
import TimerInner   from './TimerInner'

type Props = {
  iteration: ?Iteration,
  timer: Timer,
  onBtnPlayClick: () => void,
}

export default class PomodoroTimer extends Component {

  isWorking (): boolean {
    const itr = this.props.iteration
    return (itr != null) && itr.isWorking()
  }

  name (): string {
    const itr = this.props.iteration
    return (itr != null) ? `${itr.type}(${itr.numOfIteration})` : ''
  }

  props: Props;

  render () {
    const { timer, onBtnPlayClick } = this.props
    const started = timer.hasStarted()
    const working = this.isWorking()
    const remainTimeInMillis = timer.remainTimeInMillis
    return (
      <TimerWrapper
        totalTimeInMillis={timer.totalTimeInMillis}
        {...{ started, working, remainTimeInMillis }}
      >
        <TimerInner
          name={this.name()}
          {...{ started, working, remainTimeInMillis, onBtnPlayClick }}
        />
      </TimerWrapper>
    )
  }
}
