/* @flow */
import React, { Component } from 'react'

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type Props = {
  started: boolean,
  working: boolean,
  remainTimeInMillis: number,
  totalTimeInMillis: number,
  children?: React$Element<*>,
}
/* eslint-enable */

export default class TimerWrapper extends Component {

  getGradients (): Array<string> {
    const { started, working, remainTimeInMillis, totalTimeInMillis } = this.props
    // FIXME: Should import from settings/constans.css
    const colorText = '#f9f9f9'
    const bg = working ? '#a54c38' : '#5f8e58'

    const r = started ? (1 - (remainTimeInMillis / totalTimeInMillis)) : 0
    if (r < 0.5) {
      const angle = ((r / 0.5) * 180) + 90
      return [
        `linear-gradient(${angle}deg, transparent 50%, ${bg} 50%)`,
        `linear-gradient(90deg, ${bg} 50%, transparent 50%)`,
      ]
    }

    const angle = (((r - 0.5) / 0.5) * 180) + 90
    return [
      `linear-gradient(${angle}deg, transparent 50%, ${colorText} 50%)`,
      `linear-gradient(90deg, ${bg} 50%, transparent 50%)`,
    ]
  }

  props: Props;

  render () {
    const { started, working, children } = this.props
    const modifier = started ? `_${working ? 'work' : 'break'}ing` : ''
    return (
      <div
        className='PomodoroTimer'
        style={{
          backgroundImage: this.getGradients().join(', '),
        }}
      >
        <div className={`PomodoroTimer__inner-wrapper${modifier}`}>
          {children}
        </div>
      </div>
    )
  }
}
