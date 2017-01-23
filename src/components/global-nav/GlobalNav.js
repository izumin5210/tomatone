/* @flow */
import React from 'react'
import { Link } from 'react-router'

import { Category } from '../../entities'

type Props = {
  category: ?Category,
}

export default function GlobalNav ({ category }: Props) {
  const query = { category: (category == null) ? null : category.path }
  const links = [
    {
      to:   { pathname: '/', query },
      icon: 'clock-o',
    },
    {
      to:   { pathname: '/tasks', query },
      icon: 'tasks',
    },
    {
      to:   { pathname: '/history', query },
      icon: 'history',
    },
  ]
  const items = links.map(link => (
    <li className='GlobalNav__item' key={link.icon} >
      <Link
        to={link.to}
        isActive={({ pathname }, props) => pathname === props.pathname}
      >
        {({ isActive, onClick, href }) => (
          <a
            href={href}
            onClick={onClick}
            className={`GlobalNav__link${isActive ? '_active' : ''}`}
          >
            <i className={`fa fa-${link.icon}`} />
          </a>
        )}
      </Link>
    </li>
  ))
  return (
    <nav className='GlobalNav'>
      <ul className='GlobalNav__list'>
        { items }
      </ul>
    </nav>
  )
}
