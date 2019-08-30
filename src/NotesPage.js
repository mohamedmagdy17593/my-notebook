import React from 'react'
import {withRouter} from 'react-router-dom'
import Notes from './Notes'
import Nav from './Nav'

function NotesPage(props) {
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

export default withRouter(NotesPage)
