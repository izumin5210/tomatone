/* @flow */
import PromisedReducer  from "promised-reducer";

import {
  State,
} from "../models";

import {
  ACTION_TIMER_START,
  ACTION_TIMER_STOP,
  ACTION_TIMER_REFRESH,
  ACTION_ITERATIONS_GET,
} from "../settings/constants";

import {
  TasksActions,
} from "../actions";

import {
  startTimer,
  stopTimer,
  refreshTimer,
} from "./timer";

import {
  getAllIterations,
} from "./iterations";

import {
  getAllTasks,
  createTask,
  updateTask,
  completeTask,
  incompleteTask,
  selectTask,
} from "./tasks";

const initialState = new State();

export default class Reducer {
  reducer: PromisedReducer;

  constructor() {
    this.reducer = new PromisedReducer(initialState);
  }

  // FIXME: apply types
  connect(self: any, subscribe: any) {
    this.reducer.on(":update", state => self.setState({ state }));

    subscribe(ACTION_TIMER_START, () => this.update(startTimer));
    subscribe(ACTION_TIMER_STOP, () => this.update(stopTimer));
    subscribe(ACTION_TIMER_REFRESH, () => this.update(refreshTimer));
    subscribe(ACTION_ITERATIONS_GET, () => this.update(getAllIterations));

    subscribe(
      TasksActions.ACTION_TASKS_GET,
      () => this.update(getAllTasks),
    );
    subscribe(
      TasksActions.ACTION_TASK_CREATE,
      (props: TasksActions.CreateTaskAction) => (
        this.update((s: State) => createTask(s, props))
      ),
    );
    subscribe(
      TasksActions.ACTION_TASK_UPDATE,
      (props: TasksActions.UpdateTaskAction) => (
        this.update((s: State) => updateTask(s, props))
      ),
    );
    subscribe(
      TasksActions.ACTION_TASK_COMPLETE,
      (props: TasksActions.CompleteTaskAction) => (
        this.update((s: State) => completeTask(s, props))
      ),
    );
    subscribe(
      TasksActions.ACTION_TASK_INCOMPLETE,
      (props: TasksActions.IncompleteTaskAction) => (
        this.update((s: State) => incompleteTask(s, props))
      ),
    );
    subscribe(
      TasksActions.ACTION_TASK_SELECT,
      (props: TasksActions.SelectTaskAction) => (
        this.update((s: State) => selectTask(s, props))
      ),
    );
  }

  update(fn: (s: ?State) => State | Promise<State>) {
    this.reducer.update(fn);
  }

  getState(): State {
    return this.reducer.state;
  }
}
