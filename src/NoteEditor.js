/** @jsx jsx */
import {jsx} from '@emotion/core'

import {useRef, useImperativeHandle, forwardRef} from 'react'
import ContentEditable from 'react-contenteditable'
import cls from 'classnames'
import {formatEditorDocument} from './utils'

function NoteEditor({value, onChange = () => {}, className, ...rest}, ref) {
  const editorRef = useRef()

  useImperativeHandle(ref, () => {
    return {
      focus() {
        setTimeout(() => {
          editorRef.current.el.current.focus()
        })
      },
    }
  })

  return (
    <ContentEditable
      ref={editorRef}
      html={value}
      onChange={e => {
        onChange(formatEditorDocument(e.target.value))
      }}
      className={cls('content has-padding-6 has-background-white', className)}
      css={{
        borderRadius: 5,
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

export default forwardRef(NoteEditor)
