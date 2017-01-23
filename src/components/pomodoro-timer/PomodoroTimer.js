/* @flow */
import React, { Component } from 'react'

import {
  Iteration,
  Timer,
} from '../../entities'

import TimerWrapper from './TimerWrapper'
import TimerInner   from './TimerInner'

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type Props = {
  iteration: ?Iteration,
  timer: Timer,
  onBtnPlayClick: () => void,
}
/* eslint-enable */

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
