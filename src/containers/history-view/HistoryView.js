/* @flow */
import React from "react";

import {
  CategorySelector,
  IterationList,
} from "../../components";

import type {
  State,
} from "../../models";

type Props = {
  state: State;
};

export default function HistoryView({ state }: Props) {
  const { categories, tasks } = state;
  const currentCategory = state.currentCategory();
  const currentCategoryTasks = state.currentCategoryTasks();
  const iterations = state.iterations
    .filter(({ taskId }) => currentCategoryTasks.has(taskId));
  return (
    <div className="HistoryView">
      <CategorySelector
        {...{ currentCategory, categories, tasks }}
      />
      <IterationList
        {...{ iterations, tasks: currentCategoryTasks }}
      />
    </div>
  );
}

