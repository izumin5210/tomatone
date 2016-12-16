/* @flow */
import { Record } from "immutable";

// FIXME: I want to add align option to flowtype/space-after-type-colon rule...
/* eslint-disable no-multi-spaces */
export type CategoryConfig = {
  id:          number;
  name:        string;
  createdAt:   number;
};
/* eslint-enable */

const defaultValues: CategoryConfig = {
  id:        1,
  name:      "empty task",
  createdAt: 0,
};

const CategoryRecord = Record(defaultValues);

export default class Category extends CategoryRecord {
}

