/* @flow */
import PromisedReducer  from "promised-reducer";

import {
  powerSaver,
} from "../middlewares";

import {
  State,
} from "../models";

import {
  CategoriesActions,
  IterationsActions,
  MessagesActions,
  TasksActions,
  TimerActions,
} from "../actions";

import {
  startTimer,
  stopTimer,
  refreshTimer,
  restartTimer,
} from "./timer";

import {
  getAllIterations,
} from "./iterations";

import {
  getAllCategories,
} from "./categories";

import {
  getAllTasks,
  createTask,
  updateTask,
  completeTask,
  incompleteTask,
  selectTask,
  deleteTask,
  updateTaskOrder,
} from "./tasks";

import {
  pushMessage,
  removeMessage,
} from "./messages";

const initialState = new State();

export default class Reducer {
  reducer: PromisedReducer;

  constructor() {
    this.reducer = new PromisedReducer(initialState, [powerSaver]);
  }

  // FIXME: apply types
  connect(self: any, subscribe: any) {
    this.reducer.on(":update", state => self.setState({ state }));

    subscribe(TimerActions.START, () => this.update(startTimer));
    subscribe(TimerActions.STOP, () => this.update(stopTimer));
    subscribe(
      TimerActions.REFRESH,
      (props: TimerActions.RefreshAction) => (
        this.update((s: State) => refreshTimer(s, props))
      ),
    );
    subscribe(
      TimerActions.RESTART,
      (props: TimerActions.RestartAction) => (
        this.update((s: State) => restartTimer(s, props))
      ),
    );
    subscribe(IterationsActions.GET_ALL, () => this.update(getAllIterations));

    subscribe(
      MessagesActions.PUSH_MESSAGE,
      () => this.update(pushMessage),
    );
    subscribe(
      MessagesActions.REMOVE_MESSAGE,
      () => this.update(removeMessage),
    );

    subscribe(
      CategoriesActions.GET_ALL,
      () => this.update(getAllCategories),
    );
    subscribe(
      TasksActions.GET_ALL,
      () => this.update(getAllTasks),
    );
    subscribe(
      TasksActions.CREATE,
      (props: TasksActions.CreateAction) => (
        this.update((s: State) => createTask(s, props))
      ),
    );
    subscribe(
      TasksActions.UPDATE,
      (props: TasksActions.UpdateAction) => (
        this.update((s: State) => updateTask(s, props))
      ),
    );
    subscribe(
      TasksActions.COMPLETE,
      (props: TasksActions.CompleteAction) => (
        this.update((s: State) => completeTask(s, props))
      ),
    );
    subscribe(
      TasksActions.INCOMPLETE,
      (props: TasksActions.IncompleteAction) => (
        this.update((s: State) => incompleteTask(s, props))
      ),
    );
    subscribe(
      TasksActions.SELECT,
      (props: TasksActions.SelectAction) => (
        this.update((s: State) => selectTask(s, props))
      ),
    );
    subscribe(
      TasksActions.DELETE,
      (props: TasksActions.DeleteAction) => (
        this.update((s: State) => deleteTask(s, props))
      ),
    );
    subscribe(
      TasksActions.UPDATE_ORDER,
      (props: TasksActions.UpdateOrderAction) => (
        this.update((s: State) => updateTaskOrder(s, props))
      ),
    );
  }

  update(fn: (s: State, ...args: any) => State | Promise<State>) {
    this.reducer.update(fn);
  }

  getState(): State {
    return this.reducer.state;
  }
}
