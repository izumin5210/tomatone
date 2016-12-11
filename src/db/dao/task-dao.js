/* @flow */
import Dexie from "dexie";
import { List } from "immutable";

import {
  Task,
} from "../../entities";

import type { DateTimeProvider } from "../../models";

export default class TaskDao {
  db: Dexie;
  dateTimeProvider: DateTimeProvider;

  constructor(db: Dexie, dateTimeProvider: DateTimeProvider) {
    this.db = db;
    this.dateTimeProvider = dateTimeProvider;
  }

  getAll(): Promise<List<Task>> {
    return Promise.resolve(this.table.toArray())
      .then(arr => (
        arr.reduce(
          (list, attrs) => list.push(new Task(attrs)),
          List(),
        )
      ));
  }

  create(title: string): Promise<Task> {
    return Promise.resolve(this.table.orderBy("order").reverse().first())
      .then(attrs => ((attrs == null) ? 0 : attrs.order + 1))
      .then(order => this.table.put({
        title,
        createdAt: this.dateTimeProvider.nowInMilliSeconds(),
        order,
      }))
      .then(id => this.table.get(id))
      .then(attrs => new Task(attrs));
  }

  update(task: Task): Promise<Task> {
    return Promise.resolve(this.table.update(task.id, task.toJS()))
      .then(() => this.table.get(task.id))
      .then(attrs => new Task(attrs));
  }

  updateAll(tasks: List<Task>): Promise<Task> {
    return Promise.resolve(this.table.bulkPut(tasks.toArray().map(task => task.toJS())))
      .then(() => this.table.where("id").anyOf(tasks.toArray().map(task => task.id)).toArray())
      .then(attrsList => attrsList.reduce(
        (list, attrs) => list.push(new Task(attrs)),
        List(),
      ));
  }

  complete(task: Task): Promise<Task> {
    if (task.hasCompleted()) {
      return Promise.resolve(task);
    }
    const completedAt = this.dateTimeProvider.nowInMilliSeconds();

    return Promise.resolve(this.table.update(task.id, { completedAt }))
      .then(() => this.table.get(task.id))
      .then(attrs => new Task(attrs));
  }

  incomplete(task: Task): Promise<Task> {
    if (!task.hasCompleted()) {
      return Promise.resolve(task);
    }

    return Promise.resolve(this.table.update(task.id, { completedAt: null }))
      .then(() => this.table.get(task.id))
      .then(attrs => new Task(attrs));
  }

  delete(task: Task): Promise<Task> {
    return Promise.resolve(this.table.delete(task.id))
      .then(() => task);
  }

  get table(): Dexie.WriteableTable {
    return this.db.tasks;
  }
}
