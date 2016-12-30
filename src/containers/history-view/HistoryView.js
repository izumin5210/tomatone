/* @flow */
import React from "react";

import {
  State,
} from "../../models";

import {
  IterationList,
} from "../../components";

type Props = {
  state: State;
};

export default function HistoryView({ state }: Props) {
  const { iterations, tasks } = state;
  return (
    <div className="HistoryView">
      <IterationList
        {...{ iterations, tasks }}
      />
    </div>
  );
}

