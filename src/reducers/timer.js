/* @flow */

import {
  Iteration,
} from "../entities";

import {
  State,
} from "../models";

function nextId(state: State): number {
  const latestItr = state.iterations.maxBy(itr => itr.id);
  return (latestItr === undefined) ? 1 : (latestItr.id + 1);
}

export function startTimer(state: State): State {
  let nextItr: Iteration;
  if (state.timer.hasStarted()) {
    const id = state.timer.currentIterationId;
    const itr: Iteration = state.iterations.find(v => v.id === id);
    nextItr = itr.next();
  } else {
    nextItr = Iteration.createFirst(nextId(state));
  }

  return state
    .set("iterations", state.iterations.push(nextItr))
    .set("timer", state.timer.updateIteration(nextItr));
}

export function stopTimer(state: State): State {
  return state.set("timer", state.timer.stop());
}
