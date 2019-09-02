/** @jsx jsx */
import {jsx} from '@emotion/core'

import {useReducer, useEffect, useRef} from 'react'
import ContentEditable from 'react-contenteditable'
import {MdReorder} from 'react-icons/md'
import {withRouter} from 'react-router-dom'
import cls from 'classnames'
import uuid from 'uuid'
import _ from 'lodash'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import {
  formatEditorDocument,
  myDateFormat,
  getNotes,
  updateNotes,
} from './utils'
import {useAuth} from './auth'
import FloatButton from './FloatButton'

function noteReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_DATE': {
      const {day, month, year} = action
      return {
        ...state,
        notes: null,
        currentDate: myDateFormat({day, month, year}),
      }
    }
    case 'SET_NOTES': {
      return {
        ...state,
        notes: action.notes,
      }
    }
    case 'ADD_NOTE': {
      return {
        ...state,
        notes: [...state.notes, {id: uuid(), text: ''}],
      }
    }
    case 'ORDER_NOTES': {
      const {sourceIndex, destinationIndex} = action
      const notes = [...state.notes]
      ;[notes[sourceIndex], notes[destinationIndex]] = [
        notes[destinationIndex],
        notes[sourceIndex],
      ]
      return {...state, notes}
    }
    case 'CHANGE_NOTE_TEXT': {
      const {id, text} = action
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === id ? {...note, text} : note,
        ),
      }
    }
    default: {
      throw new Error(`unsupported action ${action.type}`)
    }
  }
}

function Notes({
  match: {
    params: {day, month, year},
  },
}) {
  const {user} = useAuth()
  const [{notes, currentDate}, dispatch] = useReducer(noteReducer, {
    notes: null,
    currentDate: {},
  })

  /**
   * when date change reset notes
   */

  useEffect(() => {
    dispatch({type: 'CHANGE_DATE', day, month, year})
  }, [day, month, year])

  /**
   * getNotes in first start
   */

  useEffect(() => {
    if (currentDate.date) {
      getNotes({uid: user.uid, currentDate}).then(({notes = []}) => {
        dispatch({type: 'SET_NOTES', notes})
      })
    }
  }, [currentDate, user.uid])

  /**
   * auto update in first start
   */

  const updateFnRef = useRef(
    _.debounce(({uid, currentDate, notes}) => {
      updateNotes({
        uid,
        currentDate,
        notes,
      })
    }, 500),
  )

  useEffect(() => {
    if (notes) {
      updateFnRef.current({uid: user.uid, currentDate, notes})
    }
  }, [currentDate, notes, user.uid])

  /**
   * actions
   */

  function handleNoteChange({id, text}) {
    dispatch({type: 'CHANGE_NOTE_TEXT', id, text})
  }

  function handleAddNewNote() {
    dispatch({type: 'ADD_NOTE'})
  }

  function handleDragEnd(result) {
    if (!result.destination) {
      return
    }
    const {index: sourceIndex} = result.source
    const {index: destinationIndex} = result.destination
    dispatch({type: 'ORDER_NOTES', sourceIndex, destinationIndex})
  }

  return (
    <div>
      {notes &&
        (notes.length === 0 ? (
          <p css={{textAlign: 'center'}}>
            No notes {'😱'} <button onClick={handleAddNewNote}>add one</button>
          </p>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {provided => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  css={{padding: 12}}
                >
                  {notes.map((note, index) => (
                    <Draggable
                      key={note.id}
                      draggableId={note.id}
                      index={index}
                    >
                      {provided => (
                        <div
                          key={note.id}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="is-flex has-margin-b-6"
                          style={provided.draggableProps.style}
                        >
                          <div className="has-margin-r-7">
                            <div
                              {...provided.dragHandleProps}
                              className="has-padding-7"
                            >
                              <MdReorder></MdReorder>
                            </div>
                          </div>
                          <NoteEditor
                            value={note.text}
                            onChange={text =>
                              handleNoteChange({id: note.id, text})
                            }
                            css={{width: '100%'}}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ))}

      <FloatButton
        className="button is-link is-large"
        onClick={handleAddNewNote}
      >
        +
      </FloatButton>
    </div>
  )
}

function NoteEditor({value, onChange = () => {}, className, ...rest}) {
  const editorRef = useRef()

  useEffect(() => {
    editorRef.current.el.current.focus()
  }, [])

  return (
    <ContentEditable
      ref={editorRef}
      html={value}
      onChange={e => {
        onChange(formatEditorDocument(e.target.value))
      }}
      className={cls('content has-padding-6 has-background-white', className)}
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

export default withRouter(Notes)
