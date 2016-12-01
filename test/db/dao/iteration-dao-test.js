/* @flow */
import Iteration from "../../../src/entities/iteration";
import Task      from "../../../src/entities/task";

import {
  db,
  iterationDao as dao,
} from "../../../src/db";

describe("IterationDao", () => {
  // TODO: Should move to test-helper
  beforeEach(() => db.delete().then(db.open));
  afterEach(() => db.delete().then(db.close));

  beforeEach(() => Promise.resolve(db.tasks.bulkPut([
    { title: "awesome task 1" },
    { title: "awesome task 2" },
    { title: "awesome task 3" },
    { title: "awesome task 4" },
  ])));

  describe("#getAll()", () => {
    it("returns all saved iterations", () => {
      let i = 1;
      return db.iterations
        .bulkPut([
          { type: "WORK", numOfIteration: i },
          { type: "SHORT_BREAK", numOfIteration: (i += 1) },
          { type: "WORK", numOfIteration: i },
          { type: "SHORT_BREAK", numOfIteration: (i += 1) },
          { type: "WORK", numOfIteration: i },
          { type: "SHORT_BREAK", numOfIteration: (i += 1) },
          { type: "WORK", numOfIteration: i },
          { type: "LONG_BREAK", numOfIteration: (i += 1) },
        ])
        .then(() => db.iterations.count())
        .then(count => assert(count === 8))
        .then(() => dao.getAll())
        .then(itrs => assert(itrs.size === 8));
    });
  });

  describe("#createFirst()", () => {
    it("creates a 1st WORK iteration", () => (
      Promise.resolve(db.tasks.get(2))
        .then(attrs => dao.createFirst(new Task(attrs)))
        .then((itr) => {
          assert(itr.type === "WORK");
          assert(itr.numOfIteration === 1);
          assert(itr.taskId === 2);
        })
        .then(() => db.iterations.count())
        .then(c => assert(c === 1))
    ));
  });

  describe("#next()", () => {
    it("create a WORK iteration and increments numOfIteration after SHORT_BREAK", () => {
      const type = "SHORT_BREAK";
      const numOfIteration = 2;
      const taskId = 2;
      const shortBreakItr = new Iteration({ type, numOfIteration, taskId });
      return dao.next(shortBreakItr)
        .then((itr) => {
          assert(itr.type === "WORK");
          assert(itr.numOfIteration === numOfIteration + 1);
          assert(itr.taskId === taskId);
          return Promise.resolve(db.iterations.count());
        })
        .then(count => assert(count, 2));
    });

    it("create a WORK iteration and increments numOfIteration after LONG_BREAK", () => {
      const type = "LONG_BREAK";
      const numOfIteration = 4;
      const shortBreakItr = new Iteration({ type, numOfIteration });
      return dao.next(shortBreakItr)
        .then((itr) => {
          assert(itr.type, "WORK");
          assert(itr.numOfIteration, numOfIteration + 1);
          return Promise.resolve(db.iterations.count());
        })
        .then(count => assert(count, 2));
    });

    it("create a SHORT_BREAK iteration after a 2nd WORK iteration", () => {
      const numOfIteration = 2;
      const shortBreakItr = new Iteration({ numOfIteration });
      return dao.next(shortBreakItr)
        .then((itr) => {
          assert(itr.type, "SHORT_BREAK");
          assert(itr.numOfIteration, numOfIteration);
          return Promise.resolve(db.iterations.count());
        })
        .then(count => assert(count, 2));
    });

    it("create a LONG_BREAK iteration after a 4th WORK iteration", () => {
      const numOfIteration = 4;
      const shortBreakItr = new Iteration({ numOfIteration });
      return dao.next(shortBreakItr)
        .then((itr) => {
          assert(itr.type, "LONG_BREAK");
          assert(itr.numOfIteration, numOfIteration);
          return Promise.resolve(db.iterations.count());
        })
        .then(count => assert(count, 2));
    });
  });

  describe("#stop()", () => {
    it("update totalTimeInMillis", () => {
      let ms = 0;
      return Promise.resolve(db.tasks.get(1))
        .then(attrs => dao.createFirst(new Task(attrs)))
        .then((itr) => {
          ms = itr.totalTimeInMillis;
          return dao.stop(itr);
        })
        .then(itr => assert(itr.totalTimeInMillis < ms))
        .then(() => Promise.resolve(db.iterations.count()))
        .then(count => assert(count, 1));
    });
  });

  describe("#setTask()", () => {
    it("sets the given task to the iteration", () => (
      Promise.resolve(db.iterations.put({ type: "WORK", numOfIteration: 1, taskId: 1 }))
        .then(() => Promise.all([
          Promise.resolve(db.iterations.get(1)).then(attrs => new Iteration(attrs)),
          Promise.resolve(db.tasks.get(2)).then(attrs => new Task(attrs)),
        ]))
        .then((results) => {
          const itr = results[0];
          const task = results[1];
          return dao.setTask(itr, task)
            .then((newItr) => {
              assert(newItr.taskId === task.id);
            });
        })
    ));
  });
});
