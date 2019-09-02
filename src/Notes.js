/** @jsx jsx */
import {jsx} from '@emotion/core'

import {useReducer, useEffect, useRef, useMemo} from 'react'
import ContentEditable from 'react-contenteditable'
import {MdReorder} from 'react-icons/md'
import {FaPlus, FaTrash} from 'react-icons/fa'
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

function notesReducer(state, action) {
  switch (action.type) {
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
    case 'DELETE_NOTE': {
      const {id} = action
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== id),
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

  const [{notes}, dispatch] = useReducer(notesReducer, {notes: null})

  const currentDate = useMemo(() => myDateFormat({day, month, year}), [
    day,
    month,
    year,
  ])
  const currentDateRef = useRef()
  currentDateRef.current = currentDate

  console.log({
    notes,
  })

  /**
   * getNotes in first start
   */

  useEffect(() => {
    dispatch({type: 'SET_NOTES', notes: null})
    getNotes({uid: user.uid, currentDate}).then(({notes = []}) => {
      dispatch({type: 'SET_NOTES', notes})
    })
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

  // this only depends on notes changes
  useEffect(() => {
    if (notes) {
      updateFnRef.current({
        uid: user.uid,
        currentDate: currentDateRef.current,
        notes,
      })
    }
  }, [notes, user.uid])

  /**
   * actions
   */

  function handleNoteChange({id, text}) {
    dispatch({type: 'CHANGE_NOTE_TEXT', id, text})
  }

  function handleAddNewNote() {
    dispatch({type: 'ADD_NOTE'})
  }

  function handleDelete({id}) {
    dispatch({type: 'DELETE_NOTE', id})
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
          <NotesDragDropContainer onDragEnd={handleDragEnd}>
            {notes.map((note, index) => (
              <Draggable key={note.id} draggableId={note.id} index={index}>
                {provided => (
                  <NoteItem
                    note={note}
                    onChange={handleNoteChange}
                    onDelete={handleDelete}
                    dragProvider={provided}
                  ></NoteItem>
                )}
              </Draggable>
            ))}
          </NotesDragDropContainer>
        ))}

      <FloatButton
        className="button is-link is-large"
        onClick={handleAddNewNote}
      >
        <FaPlus></FaPlus>
      </FloatButton>
    </div>
  )
}

function NotesDragDropContainer({onDragEnd, children}) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {provided => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            css={{padding: 12}}
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

function NoteItem({note, dragProvider, onNoteChange, onDelete}) {
  return (
    <div
      key={note.id}
      ref={dragProvider.innerRef}
      {...dragProvider.draggableProps}
      className="is-flex has-margin-b-6"
      style={dragProvider.draggableProps.style}
      css={{padding: 12}}
    >
      <div css={{margin: 4}}>
        <div {...dragProvider.dragHandleProps} className="has-padding-7">
          <MdReorder></MdReorder>
        </div>
      </div>
      <div css={{width: '100%'}}>
        <nav css={{display: 'flex', padding: 8, button: {margin: 4}}}>
          <button
            className="button is-small is-danger"
            onClick={() =>
              window.confirm('Are you sure to delete this?') &&
              onDelete({id: note.id})
            }
          >
            <FaTrash></FaTrash>
          </button>
          <button
            className="button is-small"
            onClick={() => console.log('delete')}
          >
            mark
          </button>
          <span></span>
        </nav>
        <NoteEditor
          value={note.text}
          onChange={text => onNoteChange({id: note.id, text})}
        />
      </div>
    </div>
  )
}

function NoteEditor({value, onChange = () => {}, className, ...rest}) {
  const editorRef = useRef()

  // useEffect(() => {
  //   editorRef.current.el.current.focus()
  // }, [])

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
