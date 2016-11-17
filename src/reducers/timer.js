import {
  Iteration,
  Timer,
} from "../entities";

function nextId(state) {
  const latestItr = state.get("iterations").maxBy(itr => itr.id);
  return (latestItr === undefined) ? 1 : (latestItr.id + 1);
}

export function startTimer(state) {
  let nextItr;
  if (state.get("timer").hasStarted) {
    const id = state.get("timer").currentIterationId;
    const itr = state.get("iterations").find(v => v.id === id);
    nextItr = (itr === undefined) ? Iteration.createFirst(nextId(state)) : itr.next;
  } else {
    nextItr = Iteration.createFirst(nextId(state));
  }

  return state
    .update("iterations", v => v.push(nextItr))
    .update("timer", v => v.setIteration(nextItr));
}

export function stopTimer(state) {
  return state.update("timer", v => v.stop());
}

export function checkTimer(state, update) {
  const timer = state.get("timer");
  if (timer.hasStarted) {
    const id = timer.currentIterationId;
    const itr = state.get("iterations").find(v => v.id === id);
    if (itr.isFinished) {
      update(startTimer);
    }
  }
}
