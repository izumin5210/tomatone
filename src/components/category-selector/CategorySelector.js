/* @flow */
import React, { Component } from 'react'
import { Map }              from 'immutable'

import {
  Category,
  Task,
} from '../../entities'

import CategoryPath from '../category-path'
import CategoryTree        from './CategoryTree'

type Props = {
  currentCategory: Category,
  categories: Map<number, Category>,
  tasks: Map<number, Task>,
}

type State = {
  opened: boolean,
}

export default class CategorySelector extends Component {

  constructor (props: Props) {
    super(props)
    this.state = {
      opened: false,
    }
  }

  state: State;

  setOpened (opened: boolean) {
    this.setState({ opened })
  }

  props: Props;

  render () {
    const { currentCategory, categories, tasks } = this.props
    const { opened } = this.state
    const modifier = opened ? '_opened' : ''
    const taskCounts = tasks
      .filterNot(task => task.hasCompleted())
      .countBy(task => task.categoryId)
      .set(Category.ALL.id, tasks.size)

    /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/onclick-has-focus, jsx-a11y/no-static-element-interactions */
    return (
      <div
        className={`CategorySelector${modifier}`}
        onClick={() => {
          if (opened) { this.setOpened(false) }
        }}
        role='presentation'
      >
        <button
          className={`CategorySelector__button-open${modifier}`}
          onClick={() => this.setOpened(!opened)}
        >
          <CategoryPath
            {...{ category: currentCategory, categories }}
          />
        </button>
        { opened && <CategoryTree
          {...{ currentCategory, categories, taskCounts }}
          close={() => this.setOpened(false)}
          depth={1}
        /> }
      </div>
    )
    /* eslint-enable */
  }
}
