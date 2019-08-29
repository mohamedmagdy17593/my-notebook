import React, {useEffect, useState, createContext, useContext} from 'react'
import firebase from './firebase'

const authContext = createContext()

function AuthProvider({children}) {
  const [user, setUser] = useState(null)
  const [authAttempt, setAuthAttempt] = useState(false)

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(user => {
      setAuthAttempt(true)
      if (user) {
        const {uid, email, displayName, photoURL} = user
        setUser({
          uid,
          email,
          displayName,
          photoURL,
        })
      } else {
        setUser(null)
      }
    })
  }, [])

  return (
    <authContext.Provider value={{user, authAttempt}}>
      {children}
    </authContext.Provider>
  )
}

function useAuth() {
  return useContext(authContext)
}

export {AuthProvider, useAuth}
