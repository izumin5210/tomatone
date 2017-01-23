/* @flow */
import Dexie from 'dexie'

import defineSchemata from './schemata'

export default class Database extends Dexie {
  constructor (name: string, opts: Object = {}) {
    super(name, opts)
    defineSchemata(this)
  }
}
