import React from 'react'
import Notes from './Notes'

function NotesPage() {
  return (
    <div className="columns">
      <div className="column is-three-fifths is-offset-one-fifth">
        <div className="has-padding-4">
          <Notes></Notes>
        </div>
      </div>
    </div>
  )
}

export default NotesPage
