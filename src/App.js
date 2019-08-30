/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react' // eslint-disable-line
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom'
import {FaGoogle} from 'react-icons/fa'
import {loginWithGoogle, myDateFormat} from './utils'
import {useAuth} from './auth'
import NotFound from './NotFound'
import NotePage from './NotesPage'

function App() {
  const {user, authAttempt} = useAuth()

  if (!authAttempt) {
    return null
  }

  return (
    <div className="App has-background-white-bis" css={{minHeight: '100vh'}}>
      {authAttempt ? (
        user ? (
          <AuthApp></AuthApp>
        ) : (
          <UnAuthApp></UnAuthApp>
        )
      ) : null}
    </div>
  )
}

function UnAuthApp() {
  return (
    <div
      css={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <button className="button is-info" onClick={loginWithGoogle}>
        <FaGoogle></FaGoogle>&nbsp;&nbsp;&nbsp;Sign in with google
      </button>
    </div>
  )
}

function AuthApp() {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/"
          exact
          render={() => (
            <Redirect
              to={`/note/${myDateFormat(new Date()).string}`}
            ></Redirect>
          )}
        ></Route>
        <Route
          path="/note"
          exact
          render={() => (
            <Redirect
              to={`/note/${myDateFormat(new Date()).string}`}
            ></Redirect>
          )}
        ></Route>
        <Route path="/note/:day/:month/:year" component={NotePage}></Route>
        <Route component={NotFound}></Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App
