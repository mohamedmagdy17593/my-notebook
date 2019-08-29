/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react' // eslint-disable-line
import Nav from './Nav'
import Notes from './Notes'
import {FaGoogle} from 'react-icons/fa'
import {loginWithGoogle} from './utils'
import {useAuth} from './auth'

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
    <>
      <Nav></Nav>
      <div className="columns">
        <div className="column is-three-fifths is-offset-one-fifth">
          <div className="has-padding-4">
            <Notes></Notes>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
