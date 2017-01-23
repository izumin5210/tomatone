/* @flow */
import React from 'react'

export type Props = {
  children?: React$Element<*>,
  close: () => void,
}

export default function ComposerModal (props: Props) {
  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/onclick-has-focus, jsx-a11y/no-static-element-interactions */
  return (
    <div
      className='ComposerModal'
      onClick={props.close}
      role='presentation'
    >
      <div
        className='ComposerModal__modal'
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
        }}
        role='presentation'
      >
        { props.children }
      </div>
    </div>
  )
  /* eslint-enable */
}
