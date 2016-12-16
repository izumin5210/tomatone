/* @flow */
import Dexie from "dexie";
import { List } from "immutable";

import {
  Category,
} from "../../entities";

import type { DateTimeProvider } from "../../models";

export default class CategoryDao {
  db: Dexie;
  dateTimeProvider: DateTimeProvider;

  constructor(db: Dexie, dateTimeProvider: DateTimeProvider) {
    this.db = db;
    this.dateTimeProvider = dateTimeProvider;
  }

  getAll(): Promise<List<Category>> {
    return Promise.resolve(this.table.toArray())
      .then(arr => (
        arr.reduce(
          (list, attrs) => list.push(new Category(attrs)),
          List(),
        )
      ));
  }

  create(name: string): Promise<Category> {
    const createdAt = this.dateTimeProvider.nowInMilliSeconds();
    return Promise.resolve(this.table.put({ name, createdAt }))
      .then(id => this.table.get(id))
      .then(attrs => new Category(attrs));
  }

  update(category: Category): Promise<Category> {
    return Promise.resolve(this.table.update(category.id, category.toJS()))
      .then(() => this.table.get(category.id))
      .then(attrs => new Category(attrs));
  }

  delete(category: Category): Promise<Category> {
    return Promise.resolve(this.table.delete(category.id))
      .then(() => category);
  }

  get table(): Dexie.WriteableTable {
    return this.db.categories;
  }
}
