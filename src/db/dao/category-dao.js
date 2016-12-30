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

  findOrCreateByName(name: string): Promise<Category> {
    return Promise.resolve(this.table.where("name").equals(name).toArray())
      .then((attrsList) => {
        if (attrsList.length === 0) {
          const createdAt = this.dateTimeProvider.nowInMilliSeconds();
          return this.table.put({ name, createdAt })
            .then(id => this.table.get(id));
        }

        return attrsList[0];
      })
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

  async deleteAll(categories: List<Category>): Promise<List<Category>> {
    await this.table.bulkDelete(categories.map(({ id }) => id).toArray());
    return categories;
  }

  get table(): Dexie.WriteableTable {
    return this.db.categories;
  }
}
