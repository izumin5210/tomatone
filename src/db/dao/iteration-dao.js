/* @flow */
import Dexie from "dexie";

import {
  Iteration,
  IterationType,
} from "../../entities";

export default class IterationDao {
  db: Dexie;

  constructor(db: Dexie) {
    this.db = db;
  }

  createFirst(): Promise<Iteration> {
    const startedAt = Date.now();
    const type: IterationType = "WORK";
    const numOfIteration = 1;
    const totalTimeInMillis = Iteration.TIMES[type];

    return this.create({
      startedAt,
      type,
      numOfIteration,
      totalTimeInMillis,
    });
  }

  next(itr: Iteration): Promise<Iteration> {
    let type: IterationType = "WORK";
    let numOfIteration: number = itr.numOfIteration;
    if (itr.type === "WORK") {
      const isLongBreak = itr.numOfIteration % Iteration.MAX_ITERATIONS === 0;
      type = isLongBreak ? "LONG_BREAK" : "SHORT_BREAK";
    } else {
      numOfIteration += 1;
    }
    const startedAt = Date.now();
    const totalTimeInMillis = Iteration.TIMES[type];

    return this.create({
      startedAt,
      type,
      numOfIteration,
      totalTimeInMillis,
    });
  }

  stop(itr: Iteration): Promise<Iteration> {
    return this.update(itr, { totalTimeInMillis: Date.now() - itr.startedAt });
  }

  create(props: any): Promise<Iteration> {
    return Promise.resolve(this.table.put(props))
      .then(() => new Iteration(props));
  }

  update(itr: Iteration, props: any): Promise<Iteration> {
    return Promise.resolve(this.table.update(itr.id, props))
      .then(() => Object.keys(props).reduce((newItr, key) => newItr.set(key, props[key]), itr));
  }

  get table(): Dexie.WriteableTable {
    return this.db.iterations;
  }
}
