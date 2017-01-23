/* @flow */
import React    from 'react'
import { Link } from 'react-router'
import { Map }  from 'immutable'

import {
  Category,
} from '../../entities'

export type Props = {
  category: Category,
  categories: Map<number, Category>,
}

export default function CategoryPath ({ category, categories }: Props) {
  if (!categories.has(category.id)) {
    return null
  }

  const items = categories
    .filter(cat => cat.isParentOf(category) || (cat.id === category.id))
    .sortBy(cat => cat.depth)
    .map(cat => (
      <li key={`category-${cat.id}`} className='CategoryPath__item'>
        <Link
          to={{ query: { category: cat.path } }}
          onClick={e => e.stopPropagation()}
        >
          {cat.subName}
        </Link>
      </li>
    ))
    .toArray()

  return (
    <ul className='CategoryPath'>
      {items}
    </ul>
  )
}
