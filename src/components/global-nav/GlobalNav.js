/* @flow */
import React from "react";
import { Link } from "react-router";

export default function GlobalNav() {
  const links = [
    {
      to:   "/",
      icon: "clock-o",
    },
    {
      to:   "/tasks",
      icon: "tasks",
    },
    {
      to:   "/history",
      icon: "history",
    },
  ];
  const items = links.map(link => (
    <li className="GlobalNav__item" key={link.icon} >
      <Link to={link.to} activeOnlyWhenExact >
        {({ isActive, onClick, href }) => (
          <a
            href={href}
            onClick={onClick}
            className={`GlobalNav__link${isActive ? "_active" : ""}`}
          >
            <i className={`fa fa-${link.icon}`} />
          </a>
        )}
      </Link>
    </li>
  ));
  return (
    <nav className="GlobalNav">
      <ul className="GlobalNav__list">
        { items }
      </ul>
    </nav>
  );
}
