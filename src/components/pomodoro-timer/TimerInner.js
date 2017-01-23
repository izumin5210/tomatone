/* @flow */
import React, { Component } from 'react'

import BtnStart from './BtnStart'

type Props = {
  name: string,
  started: boolean,
  working: boolean,
  remainTimeInMillis: number,
  onBtnPlayClick: () => void,
}

export default class TimerInner extends Component {

  props: Props;

  remainTime (): string {
    const { remainTimeInMillis } = this.props
    const s = Math.round(((remainTimeInMillis < 0) ? 0 : remainTimeInMillis) / 1000)
    const sec = s % 60
    const min = Math.floor(s / 60)
    return `${min}:${(`00${sec}`).slice(-2)}`
  }

  render () {
    const { started, working, name, onBtnPlayClick } = this.props
    const modifier = started ? `_${working ? 'work' : 'break'}ing` : ''
    return (
      <div>
        <h2 className='PomodoroTimer__name'>
          {name}
        </h2>
        <span className='PomodoroTimer__time'>
          {this.remainTime()}
        </span>
        <BtnStart
          {...{ started, modifier }}
          onClick={onBtnPlayClick}
        />
      </div>
    )
  }
}
