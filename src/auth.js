import React, {useEffect, useState, createContext, useContext} from 'react'
import firebase, {db} from './firebase'

const authContext = createContext()

function AuthProvider({children}) {
  const [user, setUser] = useState(null)
  const [authAttempt, setAuthAttempt] = useState(false)

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(firebaseUser => {
      setAuthAttempt(true)
      if (firebaseUser) {
        const {uid, email, displayName, photoURL} = firebaseUser
        const user = {uid, email, displayName, photoURL}
        // set local user
        setUser(user)
        // set collection
        db.collection('users')
          .doc(user.uid)
          .set(user, {merge: true})
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
