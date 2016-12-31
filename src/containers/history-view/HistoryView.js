/* @flow */
import React from "react";

import {
  State,
} from "../../models";

import {
  CategorySelector,
  IterationList,
} from "../../components";

type Props = {
  state: State;
};

export default function HistoryView({ state }: Props) {
  const { categories, iterations, tasks } = state;
  const currentCategory = state.currentCategory();
  return (
    <div className="HistoryView">
      <CategorySelector
        {...{ currentCategory, categories, tasks }}
      />
      <IterationList
        {...{ currentCategory, iterations, tasks }}
      />
    </div>
  );
}

