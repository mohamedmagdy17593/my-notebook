import React from 'react'
import {withRouter, Link} from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {useAuth} from './auth'
import firebase from './firebase'
import {myDateFormat} from './utils'

const DateInput = React.forwardRef(({value, onClick}, ref) => (
  <button
    className="button is-warning is-light is-small"
    ref={ref}
    onClick={onClick}
  >
    {value}
  </button>
))

function Nav({
  history,
  match: {
    params: {day, month, year},
  },
}) {
  const {user} = useAuth()
  const {date} = myDateFormat({day, month, year})
  return (
    <nav
      className="navbar is-dark"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          {'📒'}myNote
        </Link>
      </div>

      <div className="navbar-start">
        <div className="navbar-item">
          <DatePicker
            selected={date}
            onChange={date => {
              history.push(`/note/${myDateFormat(date).string}`)
            }}
            dateFormat="dd/MM/yyyy"
            customInput={<DateInput></DateInput>}
          />
        </div>
      </div>

      <div className="navbar-end">
        <div className="navbar-item has-dropdown is-hoverable">
          <span className="navbar-link">{user.displayName}</span>

          <div className="navbar-dropdown">
            <span
              role="button"
              className="navbar-item"
              style={{cursor: 'pointer'}}
              onClick={() => firebase.auth().signOut()}
            >
              Logout
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default withRouter(Nav)
