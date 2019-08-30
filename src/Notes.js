/** @jsx jsx */
import {jsx} from '@emotion/core'

import {useState} from 'react'
import ContentEditable from 'react-contenteditable'
import {formatEditorDocument} from './utils'
import {MdReorder} from 'react-icons/md'
import ctx from 'classnames'

function Notes() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      position: 1,
      text: '',
    },
    {
      id: 2,
      position: 2,
      text: '',
    },
    {
      id: 3,
      position: 3,
      text: '',
    },
    {
      id: 4,
      position: 4,
      text: '',
    },
  ])

  function handleNoteChange({id, text}) {
    setNotes(notes.map(note => (note.id === id ? {...note, text} : note)))
  }

  return (
    <div>
      {notes.map(note => (
        <div key={note.id} className="is-flex has-margin-bt-6">
          <div className="has-margin-r-7">
            <div className="has-padding-7">
              <MdReorder></MdReorder>
            </div>
          </div>
          <NoteEditor
            value={note.text}
            onChange={text => handleNoteChange({id: note.id, text})}
            css={{width: '100%'}}
          />
        </div>
      ))}
    </div>
  )
}

function NoteEditor({value, onChange = () => {}, className, ...rest}) {
  return (
    <ContentEditable
      html={value}
      onChange={e => {
        onChange(formatEditorDocument(e.target.value))
      }}
      className={ctx('content has-padding-6 has-background-white', className)}
      css={{
        'h1,p,ul': {
          fontWeight: 'normal',
          marginTop: '0 !important',
          marginBottom: '0 !important',
        },
      }}
      {...rest}
    />
  )
}

export default Notes
