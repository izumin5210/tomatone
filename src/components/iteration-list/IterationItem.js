/* @flow */
import React, { Component } from 'react'
import moment from 'moment'
import assert from "power-assert"; // eslint-disable-line

import type { Map } from 'immutable'

import { dateTimeProvider } from '../../models'

import CategoryPath from '../category-path'

import type {
  Category,
  Iteration,
  Task,
} from '../../entities'

/* eslint-disable no-duplicate-imports */
import type { DateTimeProvider } from '../../models'
/* eslint-enable */

/* eslint-disable no-multi-spaces */
type Props = {
  categories: Map<number, Category>,
  iteration: Iteration,
  task: Task,
  dateTimeProvider: DateTimeProvider,
}
/* eslint-enable */

export default class IterationItem extends Component {
  static TIME_FORMAT = 'YYYY/MM/DD HH:mm';

  static defaultProps = {
    dateTimeProvider,
  };

  static getFormattedDate (startedAt: number): string {
    return moment(startedAt).format(this.TIME_FORMAT)
  }

  static getTimeFrom (ms: number): string {
    return moment.duration(ms, 'ms').humanize()
  }

  getIconName (): string {
    const { iteration } = this.props
    if (!this.isFinished()) {
      return 'play'
    } else if (iteration.isWorking()) {
      return 'pencil'
    }
    return 'coffee'
  }

  isFinished (): boolean {
    const now = this.props.dateTimeProvider.nowInMilliSeconds()
    return this.props.iteration.isFinished(now)
  }

  props: Props;

  renderIcon () {
    const { iteration } = this.props
    return (
      <div className={`IterationList__icon${this.isFinished() ? '' : '_now'}`}>
        <i className={`fa fa-${this.getIconName(iteration)}`} />
      </div>
    )
  }

  renderBody () {
    const { categories, iteration, task } = this.props
    const { startedAt, totalTimeInMillis } = iteration
    const now = this.props.dateTimeProvider.nowInMilliSeconds()
    let ms = totalTimeInMillis
    if (!iteration.isFinished(now)) {
      ms -= iteration.remainTimeInMillis(now)
    }
    const category = categories.get(task.categoryId)

    assert(task != null)
    assert(category != null)

    return (
      <div className='IterationList__body'>
        <CategoryPath
          {...{ category, categories }}
        />
        <strong className='IterationList__title'>
          { task.title }
        </strong>
        <div className='IterationList__metadata'>
          <time>{IterationItem.getFormattedDate(startedAt)}</time>
          &nbsp;(for {IterationItem.getTimeFrom(ms)})
        </div>
      </div>
    )
  }

  render () {
    return (
      <li className='IterationList__item'>
        { this.renderIcon() }
        { this.renderBody() }
      </li>
    )
  }
}
