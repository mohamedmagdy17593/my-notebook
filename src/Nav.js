import React from 'react'

function Nav() {
  return (
    <nav
      className="navbar is-danger"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <a className="navbar-item" href="https://bulma.io">
            myNote
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Nav
