/* @flow */

import {
  Iteration,
} from "../entities";

import {
  State,
} from "../models";

import {
  iterationDao,
} from "../db";

import {
  getAllIterations,
} from "./iterations";

import {
  pushMessage,
} from "./messages";

import {
  TimerActions,
} from "../actions";

export function startTimer(state: State): Promise<State> {
  let promise: Promise<Iteration>;

  const task = state.currentTask();
  const itr = state.currentIteration();

  if (task == null) {
    promise = Promise.reject(new Error("Please select a task."));
  } else if (itr == null) {
    promise = iterationDao.createFirst(task);
  } else {
    promise = iterationDao.next(itr, task);
  }

  return promise
    .then(nextItr => (
      state
        .set("iterations", state.iterations.set(nextItr.id, nextItr))
        .set("timer", state.timer.updateIteration(nextItr))
    ))
    .catch(err => (
      pushMessage(
        state.set("timer", state.timer.stop()),
        { body: err.message, level: "ERROR", durationType: "LONG" },
      )
    ));
}

export function stopTimer(state: State): Promise<State> {
  const currentIteration = state.currentIteration();
  if (currentIteration == null) {
    return Promise.reject(new Error("Any iterations are not started."));
  }

  return iterationDao.stop(currentIteration)
    .then(itr => state.set("iterations", state.iterations.set(itr.id, itr)))
    .then(newState => newState.set("timer", state.timer.stop()))
    .catch(err => (
      pushMessage(
        state.set("timer", state.timer.stop()),
        { body: err.message, level: "ERROR", durationType: "LONG" },
      )
    ));
}

export function refreshTimer(
  state: State,
  { nowInMilliSeconds }: TimerActions.RefreshAction,
): State | Promise<State> {
  const itr = state.currentIteration();
  if (itr != null && itr.isFinished(nowInMilliSeconds)) {
    return startTimer(state);
  }
  const timer = state.timer
    .set("totalTimeInMillis", (itr == null) ? 0 : itr.totalTimeInMillis)
    .set("remainTimeInMillis", (itr == null) ? 0 : itr.remainTimeInMillis(nowInMilliSeconds));
  return state.set("timer", timer);
}

export function restartTimer(state: State, action: TimerActions.RestartAction): Promise<State> {
  return getAllIterations(state)
    .then((newState) => {
      const prevItr = newState.iterations.maxBy(itr => itr.startedAt);
      if (prevItr != null && !prevItr.isFinished(action.nowInMilliSeconds)) {
        return newState.set("timer", newState.timer.updateIteration(prevItr));
      }
      return newState;
    });
}
