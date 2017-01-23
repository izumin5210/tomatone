/* @flow */
import React, { Component } from 'react'
import type { Map }         from 'immutable'

import ComposerModal from './ComposerModal'
import ComposerForm  from './ComposerForm'

import type { Category } from '../../entities'

export type Props = {
  currentCategory: Category,
  categories: Map<number, Category>,
  createTask: (title: string) => void,
}

export type State = {
  opened: boolean,
}

export default class TaskComposer extends Component {

  constructor (props: Props) {
    super(props)
    this.state = { opened: false }
  }

  state: State;
  props: Props;

  close () {
    this.setState({ opened: false })
  }

  renderModal () {
    const { currentCategory, categories, createTask } = this.props
    return (
      <ComposerModal
        close={() => this.close()}
      >
        <ComposerForm
          {...{ currentCategory, categories, createTask }}
          close={() => this.close()}
        />
      </ComposerModal>
    )
  }

  renderButton () {
    return (
      <button
        className='TaskCompoer__btn-open'
        onClick={() => this.setState({ opened: true })}
      >
        <i className='fa fa-plus' />
      </button>
    )
  }

  render () {
    return (
      <div className='TaskComposer'>
        { this.state.opened && this.renderModal() }
        { this.renderButton() }
      </div>
    )
  }
}
