/* @flow */
import { Record } from "immutable";

import { parseCategory } from "../utils";

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

  static get NO_CATEGORY(): Category {
    return new Category({
      id:        undefined,
      name:      "(no category)",
      createdAt: 0,
    });
  }

  isParentOf(category: Category): boolean {
    const otherNames = parseCategory(category.name);
    const selfNames = parseCategory(this.name);
    return (otherNames.length > selfNames.length) &&
      selfNames.reduce((result, name, i) => result && (name === otherNames[i]), true);
  }

  get depth(): number {
    return parseCategory(this.name).length;
  }

  get subName(): string {
    const names = parseCategory(this.name);
    return names[names.length - 1];
  }
}
