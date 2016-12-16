/* @flow */
import { Record } from "immutable";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export type TaskConfig = {
  id:          number;
  title:       string;
  createdAt:   number;
  completedAt: ?number;
  order:       number;
  categoryId?: number;
};
/* eslint-enable */

const defaultValues: TaskConfig = {
  id:          1,
  title:       "empty task",
  createdAt:   0,
  completedAt: undefined,
  order:       0,
  categoryId:  undefined,
};

const TaskRecord = Record(defaultValues);

export default class Task extends TaskRecord {
  hasCompleted(): boolean {
    return this.completedAt != null;
  }
}
