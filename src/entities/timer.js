/* @flow */
import { Record } from "immutable";
import Iteration  from "./iteration";

import Category from "../entities/category";
import Task     from "../entities/task";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export type TimerConfig = {
  currentIterationId: ?number;
  selectedCategoryId: ?number;
  selectedTaskId:     ?number;
  totalTimeInMillis:  number;
  remainTimeInMillis: number;
}
/* eslint-enable */

const defaultValues: TimerConfig = {
  currentIterationId: undefined,
  selectedCategoryId: Category.ALL.id,
  selectedTaskId:     undefined,
  totalTimeInMillis:  0,
  remainTimeInMillis: 0,
};

const TimerRecord = Record(defaultValues);

export default class Timer extends TimerRecord {

  hasStarted(): boolean {
    return this.currentIterationId !== undefined;
  }

  updateIteration(itr: Iteration): Timer {
    return this.set("currentIterationId", itr.id)
      .set("totalTimeInMillis", itr.totalTimeInMillis)
      .set("remainTimeInMillis", itr.totalTimeInMillis);
  }

  updateCategory(category: ?Category): Timer {
    const categoryId = (category == null) ? defaultValues.selectedCategoryId : category.id;
    return this.set("selectedCategoryId", categoryId);
  }

  updateTask(task: ?Task): Timer {
    return this.set("selectedTaskId", (task == null) ? undefined : task.id);
  }

  stop(): Timer {
    return this.set("currentIterationId", undefined)
      .set("totalTimeInMillis", 0)
      .set("remainTimeInMillis", 0);
  }
}
