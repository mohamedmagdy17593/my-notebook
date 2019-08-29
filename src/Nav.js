import React from 'react'
import {useAuth} from './auth'
import firebase from './firebase'

function Nav() {
  const {user} = useAuth()

  return (
    <nav
      className="navbar is-danger"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-item" href="https://bulma.io">
          myNote
        </a>
      </div>
      <div className="navbar-end">
        <div className="navbar-item">
          <button
            className="button is-light is-small"
            onClick={() => firebase.auth().signOut()}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Nav
