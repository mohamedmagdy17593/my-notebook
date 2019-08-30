import React, {useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {useAuth} from './auth'
import firebase from './firebase'

const ExampleCustomInput = React.forwardRef(({value, onClick}, ref) => (
  <button
    className="button is-warning is-light is-small"
    ref={ref}
    onClick={onClick}
  >
    {value}
  </button>
))

function Nav() {
  const {user} = useAuth()

  const [startDate, setStartDate] = useState(new Date())

  return (
    <nav
      className="navbar is-black"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-item" href="https://bulma.io">
          {'📝'}myNote
        </a>
      </div>

      <div className="navbar-start">
        <div className="navbar-item">
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            customInput={<ExampleCustomInput></ExampleCustomInput>}
          />
        </div>
      </div>

      <div className="navbar-end">
        <div className="navbar-item">{user.displayName}</div>
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
