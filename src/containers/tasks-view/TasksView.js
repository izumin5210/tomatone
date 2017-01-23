/* @flow */
import React, { Component } from 'react'
import { dispatcher }       from 'react-dispatcher-decorator'
import { Map }              from 'immutable'

import assert from 'power-assert'

import {
  TasksActions,
} from '../../actions'

import {
  CategorySelector,
  TaskComposer,
  TaskList,
} from '../../components'

import type {
  Category,
  Task,
} from '../../entities'

import type {
  State,
} from '../../models'

type Props = {
  state: State,
}

@dispatcher
export default class TasksView extends Component {

  getTaskListProps () {
    return {
      categories:      this.props.state.categories,
      completeTask:    (t: Task) => this.completeTask(t),
      updateTask:      (t: Task) => this.updateTask(t),
      selectTask:      (t: ?Task) => this.selectTask(t),
      deleteTask:      (t: Task) => this.deleteTask(t),
      selectedTaskId:  this.props.state.timer.selectedTaskId,
      updateTaskOrder: (t: Task, dest: number) => this.updateTaskOrder(t, dest),
    }
  }

  get tasks (): Map<number, Task> {
    return this.props.state.currentCategoryTasks()
  }

  get activeTasks (): Map<number, Task> {
    return this.tasks.filterNot(task => task.hasCompleted())
  }

  get completedTasks (): Map<number, Task> {
    return this.tasks.filter(task => task.hasCompleted())
  }

  get currentCategory (): Category {
    return this.props.state.currentCategory()
  }

  get childCategories (): Map<number, Category> {
    return this.props.state.categories
      .filter(c => this.currentCategory.isParentOf(c))
  }

  createTask (title: string) {
    this.context.dispatch(TasksActions.CREATE, { title })
  }

  completeTask (task: Task) {
    if (task.hasCompleted()) {
      this.context.dispatch(TasksActions.INCOMPLETE, { task })
    } else {
      this.context.dispatch(TasksActions.COMPLETE, { task })
    }
  }

  selectTask (task: ?Task) {
    this.context.dispatch(TasksActions.SELECT, { task })
  }

  updateTask (task: Task) {
    this.context.dispatch(TasksActions.UPDATE, { task })
  }

  deleteTask (task: Task) {
    this.context.dispatch(TasksActions.DELETE, { task })
  }

  updateTaskOrder (task: Task, dest: number) {
    assert(task.order !== dest)
    this.context.dispatch(TasksActions.UPDATE_ORDER, { task, order: dest })
  }

  props: Props;

  render () {
    const taskListProps = this.getTaskListProps()
    return (
      <div className='TasksView'>
        <CategorySelector
          currentCategory={this.currentCategory}
          categories={this.props.state.categories}
          tasks={this.props.state.tasks}
        />
        <h2 className='TasksView__caption'>Tasks</h2>
        <TaskList
          tasks={this.activeTasks}
          {...taskListProps}
        />
        <h2 className='TasksView__caption'>Completed tasks</h2>
        <TaskList
          tasks={this.completedTasks}
          {...taskListProps}
        />
        <TaskComposer
          currentCategory={this.currentCategory}
          categories={this.props.state.categories}
          createTask={t => this.createTask(t)}
        />
      </div>
    )
  }
}
