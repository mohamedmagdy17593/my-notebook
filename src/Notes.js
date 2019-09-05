/** @jsx jsx */
import {jsx} from '@emotion/core'

import {useReducer, useEffect, useRef, useMemo, forwardRef} from 'react'
import {MdReorder} from 'react-icons/md'
import {FaPlus, FaTrash} from 'react-icons/fa'
import {withRouter} from 'react-router-dom'
import uuid from 'uuid'
import _ from 'lodash'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import DatePicker from 'react-datepicker'
import {useAuth} from './auth'
import FloatButton from './FloatButton'
import MarkPicker from './MarkPicker'
import NoteEditor from './NoteEditor'
import {
  myDateFormat,
  getNotes,
  updateNotes,
  MoveNoteTo,
  arrayMove,
} from './utils'

function notesReducer(state, action) {
  switch (action.type) {
    case 'SET_NOTES': {
      return {
        ...state,
        notes: action.notes,
      }
    }
    case 'ADD_NOTE_AFTER_ID': {
      const {id} = action
      return {
        ...state,
        notes: state.notes.flatMap(({isNewNote, ...note}) =>
          note.id === id
            ? [note, {id: uuid(), text: '', isNewNote: true}]
            : note,
        ),
      }
    }
    case 'ADD_NOTE': {
      return {
        ...state,
        notes: [
          ...state.notes.map(({isNewNote, ...note}) => note),
          {id: uuid(), text: '', isNewNote: true},
        ],
      }
    }
    case 'DELETE_NOTE': {
      const {id} = action
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== id),
      }
    }
    case 'CHANGE_MARK': {
      const {id, color} = action
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === id ? {...note, color} : note,
        ),
      }
    }
    case 'ORDER_NOTES': {
      const {sourceIndex, destinationIndex} = action
      return {
        ...state,
        notes: arrayMove(state.notes, sourceIndex, destinationIndex),
      }
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
    currentDate,
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

  function handleAddNewNoteAfterId({id}) {
    dispatch({type: 'ADD_NOTE_AFTER_ID', id})
  }

  function handleDelete({id}) {
    dispatch({type: 'DELETE_NOTE', id})
  }

  function handleMarkChange({id, color}) {
    dispatch({type: 'CHANGE_MARK', id, color})
  }

  function handleMoveTo({id, date}) {
    const toDate = myDateFormat(date)
    const note = notes.find(note => note.id === id)
    MoveNoteTo({uid: user.uid, toDate, note}).then(() => {
      dispatch({type: 'DELETE_NOTE', id})
    })
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
                    date={currentDate.date}
                    onDelete={handleDelete}
                    onNoteChange={handleNoteChange}
                    onMarkChange={handleMarkChange}
                    onMoveTo={handleMoveTo}
                    dragProvider={provided}
                    onAddNote={handleAddNewNoteAfterId}
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

function NoteItem({
  note,
  date,
  dragProvider,
  onNoteChange,
  onDelete,
  onMarkChange,
  onMoveTo,
  onAddNote,
}) {
  const editorRef = useRef()

  useEffect(() => {
    if (note.isNewNote) {
      editorRef.current.focus()
    }
  }, [note.isNewNote])

  return (
    <div
      key={note.id}
      ref={dragProvider.innerRef}
      {...dragProvider.draggableProps}
      className="is-flex has-margin-b-6"
      style={dragProvider.draggableProps.style}
      css={{padding: 12, background: note.color, borderRadius: 5}}
    >
      <div css={{margin: 4}}>
        <div {...dragProvider.dragHandleProps} className="has-padding-7">
          <MdReorder></MdReorder>
        </div>
      </div>
      <div css={{width: '100%'}}>
        <nav css={{display: 'flex', padding: 8, button: {margin: 4}}}>
          <button
            className="button is-small"
            onClick={() =>
              window.confirm('Are you sure to delete this?') &&
              onDelete({id: note.id})
            }
          >
            <FaTrash></FaTrash>
          </button>
          <MarkPicker
            value={note.color}
            onChange={color => onMarkChange({id: note.id, color})}
          ></MarkPicker>
          <DatePicker
            selected={date}
            onChange={date => onMoveTo({id: note.id, date})}
            dateFormat="dd/MM/yyyy"
            customInput={<MoveToButton></MoveToButton>}
          ></DatePicker>
        </nav>
        <NoteEditor
          ref={editorRef}
          value={note.text}
          onChange={text => onNoteChange({id: note.id, text})}
          onKeyDown={e => {
            const isShiftEnter = e.keyCode === 13 && e.shiftKey
            if (isShiftEnter) {
              e.preventDefault()
              onAddNote({id: note.id})
            }
          }}
        />
      </div>
    </div>
  )
}

const MoveToButton = forwardRef(({value, onClick}, ref) => (
  <button className="button is-small" ref={ref} onClick={onClick}>
    move to
  </button>
))

export default withRouter(Notes)
