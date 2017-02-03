/* @flow */
import React from 'react'

export type Props = {
  children?: React$Element<*>,
  close: () => void,
}

export default function ComposerModal ({ children, close }: Props) {
  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/onclick-has-focus, jsx-a11y/no-static-element-interactions */
  return (
    <div
      className='ComposerModal'
      onClick={close}
      onKeyDown={(e) => {
        // ESC
        if (e.keyCode === 27) {
          close()
        }
      }}
      role='presentation'
      tabIndex={0}
    >
      <div
        className='ComposerModal__modal'
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
        }}
        role='presentation'
      >
        { children }
      </div>
    </div>
  )
  /* eslint-enable */
}
