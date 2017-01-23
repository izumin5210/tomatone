/* @flow */
import { Map } from 'immutable'

import {
  getAllTasks,
  createTask,
  updateTask,
  completeTask,
  incompleteTask,
  selectTask,
  deleteTask,
  updateTaskOrder,
} from 'reducers/tasks'

import Category from 'entities/category'
import Task     from 'entities/task'

import State from 'models/state'

import { db } from 'db'

describe('tasks reducer', () => {
  let state: State

  // TODO: Should move to test-helper
  beforeEach(() => db.delete().then(db.open))
  afterEach(() => db.delete().then(db.close))

  beforeEach(() => {
    state = new State({ categories: Map() })
  })

  describe('#getAllTasks()', () => {
    beforeEach(async () => {
      await db.tasks.bulkPut([
        { title: 'awesome task 1' },
        { title: 'awesome task 2' },
        { title: 'awesome task 3' },
        { title: 'awesome task 4' },
      ])
      assert(await db.tasks.count() === 4)
    })

    it('returns all iterations stored on IndexdDB', async () => {
      const { tasks } = await getAllTasks(state)
      assert(tasks.size === 4)
    })

    it('returns new tasks the state has an older one', async () => {
      let task = new Task(await db.tasks.get(1))
      state = state.set('tasks', state.tasks.set(task.id, task))
      await db.tasks.update(1, { title: 'updated task' })
      task = new Task(await db.tasks.get(1))
      const { tasks } = await getAllTasks(state)
      assert(tasks.size === 4)
      assert(tasks.get(1).title === 'updated task')
    })
  })

  describe('#createTask()', () => {
    context('when the new task has no category', () => {
      it('returns new state that has a created task', async () => {
        const { categories, tasks } = await createTask(state, { title: 'awesome task' })
        assert(categories.size === 0)
        assert(tasks.size === 1)
        assert(tasks.get(1).title === 'awesome task')
        assert(tasks.get(1).categoryId == null)
        assert(await db.tasks.count() === 1)
        assert(await db.categories.count() === 0)
      })
    })

    context('when the new task has a new category', () => {
      it('returns new state that has a created task', async () => {
        const action = { title: 'awesome category/awesome task' }
        const { categories, tasks } = await createTask(state, action)
        assert(categories.size === 1)
        assert(tasks.size === 1)
        assert(tasks.get(1).title === 'awesome task')
        assert(tasks.get(1).categoryId === 1)
        assert(categories.get(1).name === 'awesome category')
        assert(await db.tasks.count() === 1)
        assert(await db.categories.count() === 1)
      })
    })

    context('when the new task has a new nested category', () => {
      it('returns new state that has a created task', async () => {
        const action = { title: 'awesome category/nested category/awesome task' }
        const { categories, tasks } = await createTask(state, action)
        assert(categories.size === 2)
        assert(tasks.size === 1)
        assert(tasks.get(1).title === 'awesome task')
        assert(tasks.get(1).categoryId === 2)
        assert(categories.get(1).name === 'awesome category')
        assert(categories.get(2).name === 'awesome category/nested category')
        assert(await db.tasks.count() === 1)
        assert(await db.categories.count() === 2)
      })
    })

    context('when the new task has an existing category', () => {
      beforeEach(async () => {
        const id = await db.categories.bulkPut([
          { name: 'awesome category' },
          { name: 'awesome category/nested category' },
        ])
        const cat1 = new Category(await db.categories.get(id - 1))
        const cat2 = new Category(await db.categories.get(id))
        const categories = state.categories
          .set(cat1.id, cat1)
          .set(cat2.id, cat2)
        state = state.set('categories', categories)
      })

      it('returns new state that has its category', async () => {
        const action = { title: 'awesome category/alt-nested category/awesome task' }
        const { categories, tasks } = await createTask(state, action)
        assert(categories.size === 3)
        assert(tasks.size === 1)
        const task = tasks.get(1)
        assert(task.title === 'awesome task')
        assert(task.categoryId === 3)
        assert(categories.get(1).name === 'awesome category')
        assert(categories.get(task.categoryId).name === 'awesome category/alt-nested category')
        assert(await db.tasks.count() === 1)
        assert(await db.categories.count() === 3)
      })
    })
  })

  describe('#updateTask()', () => {
    let task: Task
    let category: Category

    beforeEach(async () => {
      const id = await db.categories.bulkPut([
        { name: 'awesome category' },
        { name: 'awesome category/nested category' },
      ])
      const cat1 = new Category(await db.categories.get(id - 1))
      const cat2 = new Category(await db.categories.get(id))
      category = cat1
      const categories = state.categories
        .set(cat1.id, cat1)
        .set(cat2.id, cat2)
      state = state.set('categories', categories)
    })

    context('when the task has no categories', () => {
      beforeEach(async () => {
        const id = await db.tasks.put({ title: 'awesome task' })
        task = new Task(await db.tasks.get(id))
        state = state.set('tasks', state.tasks.set(task.id, task))
      })

      context('when the updated task has no category', () => {
        it('returns new state that includes the updated task', async () => {
          const action = { task: task.set('title', 'updated task') }
          const { tasks } = await updateTask(state, action)
          assert(tasks.size === 1)
          assert(tasks.get(1).title === 'updated task')
          assert(tasks.get(1).categoryId == null)
        })
      })

      context('when updated task has a new category', () => {
        const name = 'awesome category/new category'

        beforeEach(() => {
          task = task.set('title', `${name}/updated task`)
        })

        it('returns new state that includes the updated task', async () => {
          const { tasks, categories } = await updateTask(state, { task })
          assert(tasks.size === 1)
          assert(categories.size === 2)
          assert(tasks.get(1).title === 'updated task')
          assert(tasks.get(1).categoryId === 3)
        })

        it('creates a new category', async () => {
          const { categories } = await updateTask(state, { task })
          assert(categories.get(3).name === name)
          assert((await db.categories.get(3)).name === name)
        })

        it('deletes an unused category', async () => {
          const { categories } = await updateTask(state, { task })
          assert(!categories.has(2))
          assert(await db.categories.get(2) == null)
        })
      })

      context('when updated task has an existing category', () => {
        it('returns new state that includes the updated task', async () => {
          task = task.set('title', 'awesome category/nested category/updated task')
          const { tasks, categories } = await updateTask(state, { task })
          assert(tasks.size === 1)
          assert(categories.size === 2)
          assert(tasks.get(1).title === 'updated task')
          assert(tasks.get(1).categoryId === 2)
          assert(categories.get(2).name === 'awesome category/nested category')
        })
      })
    })

    context('when the task has a category', () => {
      beforeEach(async () => {
        const id = await db.tasks.put({ title: 'awesome task', categoryId: category.id })
        task = new Task(await db.tasks.get(id))
        state = state.set('tasks', state.tasks.set(task.id, task))
      })

      context('when updated task has no category', () => {
        it('returns new state that includes the updated task', async () => {
          const { tasks } = await updateTask(state, { task: task.set('title', 'updated task') })
          assert(tasks.size === 1)
          assert(tasks.get(1).title === 'updated task')
          assert(tasks.get(1).categoryId == null)
        })
      })

      context('when updated task has the same category as before', () => {
        it('returns new state that includes the updated task', async () => {
          task = task.set('title', `${category.name}/updated task`)
          const { tasks } = await updateTask(state, { task })
          assert(tasks.size === 1)
          assert(tasks.get(1).title === 'updated task')
          assert(tasks.get(1).categoryId === category.id)
        })
      })

      context('when updated task has a new category', () => {
        const name = 'awesome category/new category'

        beforeEach(() => {
          task = task.set('title', `${name}/updated task`)
        })

        it('returns new state that includes the updated task', async () => {
          const { tasks, categories } = await updateTask(state, { task })
          assert(tasks.size === 1)
          assert(categories.size === 2)
          assert(tasks.get(1).title === 'updated task')
          assert(tasks.get(1).categoryId === 3)
        })

        it('creates a new category', async () => {
          const { categories } = await updateTask(state, { task })
          assert(categories.get(3).name === name)
          assert((await db.categories.get(3)).name === name)
        })

        it('deletes an unused category', async () => {
          const { categories } = await updateTask(state, { task })
          assert(!categories.has(2))
          assert(await db.categories.get(2) == null)
        })
      })

      context('when updated task has an existing category', () => {
        it('returns new state that includes the updated task', async () => {
          task = task.set('title', 'awesome category/nested category/updated task')
          const { tasks, categories } = await updateTask(state, { task })
          assert(tasks.size === 1)
          assert(categories.size === 2)
          assert(tasks.get(1).title === 'updated task')
          assert(tasks.get(1).categoryId === 2)
          assert(categories.get(2).name === 'awesome category/nested category')
        })
      })
    })
  })

  describe('#completeTask()', () => {
    it('returns new state that has the completed task', async () => {
      const id = await db.tasks.put({ title: 'awesome task' })
      const task = new Task(await db.tasks.get(id))
      state = state.set('tasks', state.tasks.set(task.id, task))
      const { tasks } = await completeTask(state, { task })
      assert(tasks.size === 1)
      assert(tasks.get(1).title === 'awesome task')
      assert(tasks.get(1).completedAt != null)
    })

    it('returns new state that is cleared the selected task when the completed task was selected', async () => {
      const id = await db.tasks.put({ title: 'awesome task' })
      const task = new Task(await db.tasks.get(id))
      state = state.set('tasks', state.tasks.set(task.id, task))
      state = state.set('timer', state.timer.set('selectedTaskId', task.id))
      const { tasks, timer } = await completeTask(state, { task })
      assert(tasks.size === 1)
      assert(tasks.get(1).title === 'awesome task')
      assert(tasks.get(1).completedAt != null)
      assert(timer.selectedTaskId == null)
    })
  })

  describe('#incompleteTask()', () => {
    it('returns new state that has the incompleted task', async () => {
      const id = await db.tasks.put({ title: 'awesome task', completedAt: Date.now() })
      const task = new Task(await db.tasks.get(id))
      state = state.set('tasks', state.tasks.set(task.id, task))
      const { tasks } = await incompleteTask(state, { task })
      assert(tasks.size === 1)
      assert(tasks.get(1).title === 'awesome task')
      assert(tasks.get(1).completedAt == null)
    })
  })

  describe('#selectTask()', () => {
    it('returns new state that has the selected task', () => {
      const task1 = new Task({ id: 1, title: 'awesome task 1' })
      const task2 = new Task({ id: 2, title: 'awesome task 2' })
      state = state.set('tasks', state.tasks.set(task1.id, task1).set(task2.id, task2))
      const newState = selectTask(state, { task: task2 })
      assert(newState.timer.selectedTaskId === task2.id)
    })

    it('returns new state that has no selected task', () => {
      const task1 = new Task({ id: 1, title: 'awesome task 1' })
      const task2 = new Task({ id: 2, title: 'awesome task 2' })
      state = state.set('tasks', state.tasks.set(task1.id, task1).set(task2.id, task2))
      state = state.set('timer', state.timer.set('selectedTaskId', task2.id))
      const newState = selectTask(state, { task: undefined })
      assert(newState.timer.selectedTaskId == null)
    })
  })

  describe('#deleteTask()', () => {
    beforeEach(async () => {
      await db.categories.bulkPut([
        { name: 'category 1' },
        { name: 'category 1/category 2' },
      ])
      await db.tasks.bulkPut([
        { title: 'awesome task 1' },
        { title: 'awesome task 2' },
        { title: 'awesome task 3', categoryId: 2 },
      ])
      const tasks = (await db.tasks.toArray()).map(attrs => new Task(attrs))
        .reduce((m, t) => m.set(t.id, t), Map())
      const categories = (await db.categories.toArray()).map(attrs => new Category(attrs))
        .reduce((m, c) => m.set(c.id, c), Map())
      state = state.set('categories', categories).set('tasks', tasks)
    })

    it('returns new state that removed the deleted task', async () => {
      state = state.set('timer', state.timer.updateTask(state.tasks.get(1)))
      state = await deleteTask(state, { task: state.tasks.get(2) })
      assert(state.tasks.size === 2)
      assert(state.tasks.size === 2)
      assert(state.categories.size === 2)
      assert(state.timer.selectedTaskId != null)
      assert(await db.tasks.count() === 2)
    })

    it('returns new state that removed the deleted task and clear selected task', async () => {
      state = state.set('timer', state.timer.updateTask(state.tasks.get(2)))
      state = await deleteTask(state, { task: state.tasks.get(2) })
      assert(state.tasks.size === 2)
      assert(state.categories.size === 2)
      assert(state.timer.selectedTaskId == null)
      assert(await db.tasks.count() === 2)
    })

    it('returns new state that removed the deleted task and empty categories', async () => {
      state = await deleteTask(state, { task: state.tasks.get(3) })
      assert(state.tasks.size === 2)
      assert(state.categories.size === 0)
      assert(await db.tasks.count() === 2)
      assert(await db.categories.count() === 0)
    })
  })

  describe('#updateTaskOrder()', () => {
    beforeEach(async () => {
      await db.tasks.bulkPut([
        { title: 'awesome task 1', order: 0 },
        { title: 'awesome task 2', order: 1 },
        { title: 'awesome task 3', order: 2 },
        { title: 'awesome task 4', order: 3 },
        { title: 'awesome task 5', order: 4 },
      ])
      assert(await db.tasks.count() === 5)
      const tasks = (await db.tasks.toArray()).map(attrs => new Task(attrs))
      state = tasks.reduce(
        (s, t) => s.set('tasks', s.tasks.set(t.id, t)),
        state,
      )
    })

    context('', () => {
      it('returns new state that has re-ordered tasks', async () => {
        const { tasks } = await updateTaskOrder(state, { task: state.tasks.get(4), order: 1 })
        assert(tasks.get(1).order === 0)
        assert(tasks.get(2).order === 2)
        assert(tasks.get(3).order === 3)
        assert(tasks.get(4).order === 1)
        assert(tasks.get(5).order === 4)
      })
    })

    context('', () => {
      it('returns new state that has re-ordered tasks', async () => {
        const { tasks } = await updateTaskOrder(state, { task: state.tasks.get(2), order: 3 })
        assert(tasks.get(1).order === 0)
        assert(tasks.get(2).order === 3)
        assert(tasks.get(3).order === 1)
        assert(tasks.get(4).order === 2)
        assert(tasks.get(5).order === 4)
      })
    })
  })
})
