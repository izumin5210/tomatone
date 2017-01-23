/* @flow */
import React from 'react'

type Props = {
  started: boolean,
  modifier: string,
  onClick: () => void,
}

export default function BtnStart (props: Props) {
  return (
    <button
      className={`PomodoroTimer__btn-start${props.modifier}`}
      onClick={() => props.onClick()}
    >
      <i className={`fa fa-${props.started ? 'stop' : 'play'}`} />
    </button>
  )
}
