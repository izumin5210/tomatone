/* @flow */
import React, { Component } from 'react'
import moment               from 'moment'
import { Map }              from 'immutable'

import IterationItem from './IterationItem'

import type {
  Category,
  Iteration,
  Task,
} from '../../entities'

type Props = {
  categories: Map<number, Category>,
  iterations: Map<number, Iteration>,
  tasks: Map<number, Task>,
}

export default class IterationList extends Component {

  getListItems () {
    const { categories, iterations, tasks } = this.props
    return iterations
      .sortBy(itr => -itr.id)
      .groupBy(itr => moment(itr.startedAt).format('YYYY-MM-DD'))
      .map((itrs, date) => {
        const arr = []
        arr.push((
          <li key={date} className='IterationList__date' >
            {date}
          </li>
        ))
        itrs.forEach((iteration) => {
          arr.push((
            <IterationItem
              {...{ categories, iteration }}
              task={tasks.get(iteration.taskId)}
            />
          ))
        })
        return arr
      })
  }

  props: Props;

  render () {
    return (
      <ul className='IterationList'>
        {this.getListItems()}
      </ul>
    )
  }
}
