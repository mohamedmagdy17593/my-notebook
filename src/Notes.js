/** @jsx jsx */
import {jsx} from '@emotion/core'

import {useState} from 'react'
import ContentEditable from 'react-contenteditable'
import {formatEditorDocument} from './utils'
import {MdReorder} from 'react-icons/md'
import ctx from 'classnames'

function Notes() {
  const [value, setValue] = useState('')

  return (
    <div>
      <div className="is-flex">
        <div className="has-padding-7 has-margin-r-7">
          <MdReorder></MdReorder>
        </div>
        <NoteEditor value={value} onChange={setValue} css={{width: '100%'}} />
      </div>
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
