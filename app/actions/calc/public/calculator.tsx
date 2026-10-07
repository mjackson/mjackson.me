// A port of the React calculator that lived at mjackson.me/calculator (2016)
// and mjackson.me/calc (2017-2018). Same look and keys; the behavior lives in
// ./calculator-state.ts.

import type { Handle, MixInput, RemixNode } from 'remix/component'
import { clientEntry, css, on, ref } from 'remix/component'

import {
  clearsDisplayOnly,
  initialState,
  keyFromKeyboard,
  press,
  type Key as CalculatorKey,
} from './calculator-state.ts'

export const Calculator = clientEntry(import.meta.url, function Calculator(handle: Handle) {
  let state = initialState
  let displayText: HTMLElement | undefined

  function input(key: CalculatorKey) {
    state = press(state, key)
    handle.update()
  }

  function onPress(key: CalculatorKey) {
    return on<HTMLButtonElement>('click', () => input(key))
  }

  // Shrink the display text to fit when the number gets long.
  function rescaleDisplay() {
    if (!displayText?.parentElement) return
    let scale = Math.min(1, displayText.parentElement.offsetWidth / displayText.offsetWidth)
    displayText.style.transform = `scale(${scale},${scale})`
  }

  handle.queueTask(() => {
    document.addEventListener(
      'keydown',
      (event) => {
        if (event.ctrlKey || event.metaKey || event.altKey) return

        let key = keyFromKeyboard(event.key)
        if (!key) return

        // Without this, Enter also "clicks" whichever key has focus, and "/"
        // opens Quick Find in Firefox.
        event.preventDefault()
        input(key)
      },
      { signal: handle.signal },
    )
  })

  return () => {
    handle.queueTask(rescaleDisplay)

    return (
      <div mix={calculatorStyle}>
        <div mix={displayStyle}>
          <div mix={[displayTextStyle, ref((node) => (displayText = node))]}>
            {formatDisplayValue(state.displayValue)}
          </div>
        </div>
        <div mix={keypadStyle}>
          <div mix={inputKeysStyle}>
            <div mix={functionKeysStyle}>
              <Key mix={[onPress('Clear'), functionKeyStyle]}>
                {clearsDisplayOnly(state) ? 'C' : 'AC'}
              </Key>
              <Key mix={[onPress('±'), functionKeyStyle]}>±</Key>
              <Key mix={[onPress('%'), functionKeyStyle]}>%</Key>
            </div>
            <div mix={digitKeysStyle}>
              <Key mix={[onPress('0'), digitKeyStyle, zeroKeyStyle]}>0</Key>
              <Key mix={[onPress('.'), digitKeyStyle, dotKeyStyle]} aria-label="Decimal point">
                ●
              </Key>
              {(['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const).map((digit) => (
                <Key key={digit} mix={[onPress(digit), digitKeyStyle]}>
                  {digit}
                </Key>
              ))}
            </div>
          </div>
          <div mix={operatorKeysStyle}>
            <Key mix={[onPress('/'), operatorKeyStyle]} aria-label="Divide">
              ÷
            </Key>
            <Key mix={[onPress('*'), operatorKeyStyle]} aria-label="Multiply">
              ×
            </Key>
            <Key mix={[onPress('-'), operatorKeyStyle]} aria-label="Subtract">
              −
            </Key>
            <Key mix={[onPress('+'), operatorKeyStyle]} aria-label="Add">
              +
            </Key>
            <Key mix={[onPress('='), operatorKeyStyle]} aria-label="Equals">
              =
            </Key>
          </div>
        </div>
      </div>
    )
  }
})

function Key(
  handle: Handle<{ mix: MixInput<HTMLButtonElement>; children: RemixNode; 'aria-label'?: string }>,
) {
  return () => {
    let { mix, children, 'aria-label': ariaLabel } = handle.props
    return (
      <button type="button" aria-label={ariaLabel} mix={[keyStyle, mix]}>
        {children}
      </button>
    )
  }
}

function formatDisplayValue(value: string): string {
  if (Number.isNaN(parseFloat(value))) return value // e.g. "Error"

  let language = (typeof navigator !== 'undefined' && navigator.language) || 'en-US'
  let formatted = parseFloat(value).toLocaleString(language, {
    useGrouping: true,
    maximumFractionDigits: 6,
  })

  // Add back a trailing "." or "0"s, e.g. "12." or "12.0"
  let match = value.match(/\.\d*?(0*)$/)
  if (match) formatted += /[1-9]/.test(match[0]) ? match[1] : match[0]

  return formatted
}

const calculatorStyle = css({
  width: '100%',
  height: '100%',
  background: 'black',
  display: 'flex',
  flexDirection: 'column',
})

const displayStyle = css({
  position: 'relative',
  flex: 1,
  color: 'white',
  background: '#1c191c',
  lineHeight: '130px',
  fontSize: '6em',
  overflow: 'hidden',
})

const displayTextStyle = css({
  display: 'inline-block',
  position: 'absolute',
  right: 0,
  padding: '0 30px',
  transformOrigin: 'right',
})

const keypadStyle = css({ height: '400px', display: 'flex' })

const inputKeysStyle = css({ width: '240px' })

const functionKeysStyle = css({
  display: 'flex',
  background: 'linear-gradient(to bottom, rgb(202, 202, 204) 0%, rgb(196, 194, 204) 100%)',
})

const digitKeysStyle = css({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap-reverse',
  background: '#e0e0e7',
})

const operatorKeysStyle = css({
  background: 'linear-gradient(to bottom, rgb(252, 156, 23) 0%, rgb(247, 126, 27) 100%)',
})

const keyStyle = css({
  display: 'block',
  width: '80px',
  height: '80px',
  padding: 0,
  border: 'none',
  borderTop: '1px solid #777',
  borderRight: '1px solid #666',
  background: 'none',
  color: 'inherit',
  font: 'inherit',
  textAlign: 'center',
  lineHeight: '80px',
  cursor: 'pointer',
  userSelect: 'none',
  outline: 'none',
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  '&:active': { boxShadow: 'inset 0px 0px 80px 0px rgba(0, 0, 0, 0.25)' },
  '&:focus-visible': { boxShadow: 'inset 0 0 0 2px rgba(255, 255, 255, 0.6)' },
})

// Each css() call gets its own cascade layer, and later layers win. So key
// variations are applied directly to each key, after keyStyle, rather than
// through descendant selectors on the rows.
const functionKeyStyle = css({ fontSize: '2em' })

const digitKeyStyle = css({ fontSize: '2.25em' })

const operatorKeyStyle = css({ color: 'white', borderRight: 0, fontSize: '3em' })

const zeroKeyStyle = css({
  width: '160px',
  textAlign: 'left',
  paddingLeft: '32px',
})

const dotKeyStyle = css({ paddingTop: '1em', fontSize: '0.75em' })
