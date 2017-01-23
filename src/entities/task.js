/* @flow */
import { Record } from 'immutable'

export type TaskConfig = {
  id: number,
  title: string,
  createdAt: number,
  completedAt: ?number,
  order: number,
  categoryId?: number,
}

const defaultValues: TaskConfig = {
  id:          1,
  title:       'empty task',
  createdAt:   0,
  completedAt: undefined,
  order:       0,
  categoryId:  undefined,
}

const TaskRecord = Record(defaultValues)

export default class Task extends TaskRecord {
  hasCompleted (): boolean {
    return this.completedAt != null
  }
}
