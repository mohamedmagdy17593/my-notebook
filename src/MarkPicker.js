/** @jsx jsx */
import {jsx} from '@emotion/core'

import {FaAngleDown} from 'react-icons/fa'

const COLORS = [
  'transparent',
  '#55efc4',
  '#81ecec',
  '#74b9ff',
  '#fab1a0',
  '#ff7675',
  '#fd79a8',
  '#ffeaa7',
]

function MarkPicker({onChange, value}) {
  return (
    <div className="dropdown is-hoverable">
      <div className="dropdown-trigger">
        <button
          className="button is-small"
          aria-haspopup="true"
          aria-controls="mark-picker-menu"
        >
          <span
            css={{
              borderRadius: 4,
              border: '1px solid black',
              width: 14,
              height: 14,
              display: 'inline-block',
              background: value,
            }}
          ></span>
          <span className="icon is-small">
            <FaAngleDown></FaAngleDown>
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="mark-picker-menu" role="menu">
        <div
          className="dropdown-content"
          css={{
            width: 120,
            padding: 8,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gridGap: 8,
            span: {
              height: 20,
              borderRadius: 4,
              cursor: 'pointer',
              ':hover': {border: '1px solid black'},
            },
          }}
        >
          {COLORS.map((color, i) => (
            <span
              onClick={() => onChange(color)}
              css={{background: color}}
              key={i}
            ></span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MarkPicker
