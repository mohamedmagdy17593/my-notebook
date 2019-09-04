/** @jsx jsx */
import {jsx} from '@emotion/core'

function FloatButton(props) {
  return (
    <button
      {...props}
      css={{
        position: 'fixed',
        right: 75,
        bottom: 75,
        width: 50,
        height: 50,
        borderRadius: 999,
        lineHeight: 0,
      }}
    ></button>
  )
}

export default FloatButton
