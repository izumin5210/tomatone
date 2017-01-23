/* @flow */
/* eslint-disable import/prefer-default-export */

import { Map } from 'immutable'

import {
  State,
} from '../models'

import {
  iterationDao as dao,
} from '../db'

export function getAllIterations (state: State): Promise<State> {
  return dao.getAll()
    .then(itrs => itrs.reduce(
      (map, itr) => map.set(itr.id, itr),
      Map(),
    ))
    .then(itrs => state.set('iterations', state.iterations.merge(itrs)))
}

/* eslint-enable */
