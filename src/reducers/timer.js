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

export function startTimer(state: State): Promise<State> {
  const itr = state.currentIteration();
  let promise: Promise<Iteration>;
  if (itr == null) {
    promise = iterationDao.createFirst();
  } else {
    promise = iterationDao.next(itr);
  }

  return promise.then(nextItr => (
    state
      .set("iterations", state.iterations.set(nextItr.id, nextItr))
      .set("timer", state.timer.updateIteration(nextItr))
  ));
}

export function stopTimer(state: State): Promise<State> {
  return iterationDao.stop(state.currentIteration())
    .then(itr => state.set("iterations", state.iterations.set(itr.id, itr)))
    .then(newState => newState.set("timer", state.timer.stop()));
}

export function refreshTimer(state: State): State | Promise<State> {
  const itr = state.currentIteration();
  if (itr != null && itr.isFinished()) {
    return startTimer(state);
  }
  const timer = state.timer
    .set("totalTimeInMillis", (itr == null) ? 0 : itr.totalTimeInMillis)
    .set("remainTimeInMillis", (itr == null) ? 0 : itr.remainTimeInMillis);
  return state.set("timer", timer);
}
