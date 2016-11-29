/* @flow */
import Dexie from "dexie";
import { List } from "immutable";

import {
  Task,
} from "../../entities";

export default class TaskDao {
  db: Dexie;

  constructor(db: Dexie) {
    this.db = db;
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
    return Promise.resolve(this.table.put({ title, createdAt: Date.now() }))
      .then(id => this.table.get(id))
      .then(attrs => new Task(attrs));
  }

  update(task: Task): Promise<Task> {
    return Promise.resolve(this.table.update(task.id, task.toJS()))
      .then(() => this.table.get(task.id))
      .then(attrs => new Task(attrs));
  }

  complete(task: Task): Promise<Task> {
    if (task.hasCompleted()) {
      return Promise.resolve(task);
    }

    return Promise.resolve(this.table.update(task.id, { completedAt: Date.now() }))
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

  get table(): Dexie.WriteableTable {
    return this.db.tasks;
  }
}
