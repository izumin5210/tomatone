/* @flow */
import { Record, Map, List } from "immutable";

import {
  Category,
  Iteration,
  Message,
  Task,
  Timer,
} from "../entities";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
type StateConfig = {
  categories: Map<number, Category>;
  iterations: Map<number, Iteration>;
  messages:   List<Message>;
  tasks:      Map<number, Task>;
  timer:      Timer;
};
/* eslint-enable */

const defaultValues: StateConfig = {
  categories: Map([
    [Category.ALL.id, Category.ALL],
    [Category.NO_CATEGORY.id, Category.NO_CATEGORY],
  ]),
  iterations: Map(),
  messages:   List(),
  tasks:      Map(),
  timer:      new Timer(),
};

const StateRecord = Record(defaultValues);

export default class State extends StateRecord {
  currentIteration(): ?Iteration {
    return this.iterations.get(this.timer.currentIterationId);
  }

  currentTask(): ?Task {
    return this.tasks.get(this.timer.selectedTaskId);
  }

  currentCategory(): Category {
    return this.categories.get(this.timer.selectedCategoryId);
  }

  hasStarted(): boolean {
    return this.timer.hasStarted();
  }

  isWorking(): boolean {
    const itr = this.currentIteration();
    return (itr === undefined || itr === null) ? false : itr.isWorking();
  }
}
