import { PropTypes }  from "react";
import { Record }     from "immutable";

const defaultValues = {
  currentIterationId: undefined,
};

export default class Timer extends Record(defaultValues) {

  get hasStarted() {
    return this.currentIterationId !== undefined;
  }

  setIteration(itr) {
    return this.set("currentIterationId", itr.id);
  }

  stop() {
    return this.set("currentIterationId", undefined);
  }
}

export const TimerType = PropTypes.shape({
  id: PropTypes.number,
});
