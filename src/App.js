/** @jsx jsx */
import {jsx} from '@emotion/core'

import Nav from './Nav'
import Notes from './Notes'

function App() {
  return (
    <div className="App has-background-white-bis" css={{minHeight: '100vh'}}>
      <Nav></Nav>
      <div className="columns">
        <div className="column is-three-fifths is-offset-one-fifth">
          <div className="has-padding-4">
            <Notes></Notes>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
