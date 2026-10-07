import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import {
  initialState,
  keyFromKeyboard,
  press,
  type Key,
} from './public/calculator-state.ts'

/** Presses each space-separated key, e.g. "5 + 3 =", and returns the display. */
function display(keys: string): string {
  let state = initialState
  for (let key of keys.split(' ')) state = press(state, key as Key)
  return state.displayValue
}

describe('calculator', () => {
  it('does arithmetic', () => {
    assert.equal(display('7 * 6 ='), '42')
    assert.equal(display('1 2 + 3 0 ='), '42')
    assert.equal(display('9 - 1 2 ='), '-3')
    assert.equal(display('1 / 4 ='), '0.25')
  })

  it('chains operations left to right', () => {
    assert.equal(display('2 + 3 * 4 ='), '20')
  })

  it('replaces the operator when two are pressed in a row', () => {
    assert.equal(display('5 + * 3 ='), '15')
    assert.equal(display('5 * - + 3 ='), '8')
  })

  it('starts a new number when "." follows an operator', () => {
    assert.equal(display('5 + . 5 ='), '5.5')
    assert.equal(display('8 = . 2'), '0.2')
  })

  it('rounds away floating-point noise', () => {
    assert.equal(display('0 . 1 + 0 . 2 ='), '0.3')
    assert.equal(display('1 . 1 * 3 ='), '3.3')
  })

  it('keeps the dot and trailing zeros when toggling the sign', () => {
    assert.equal(display('. ±'), '-0.')
    assert.equal(display('1 . 5 0 ±'), '-1.50')
    assert.equal(display('1 . 5 0 ± ±'), '1.50')
    assert.equal(display('± 5'), '-5')
  })

  it('backspaces to 0, never to a lone "-"', () => {
    assert.equal(display('5 ± Backspace'), '0')
    assert.equal(display('1 2 Backspace'), '1')
  })

  it('does not backspace into a computed result', () => {
    assert.equal(display('0 . 1 + 0 . 2 = Backspace'), '0.3')
  })

  it('shows Error for impossible results and recovers on the next number', () => {
    assert.equal(display('0 / 0 ='), 'Error')
    assert.equal(display('5 / 0 ='), 'Error')
    assert.equal(display('5 / 0 = + ± %'), 'Error')
    assert.equal(display('5 / 0 = 7'), '7')
    assert.equal(display('5 / 0 = 7 + 1 ='), '8')
  })

  it('clears the display with C, then everything with AC', () => {
    assert.equal(display('5 + 3 Clear 4 ='), '9')
    assert.equal(display('5 + 3 Clear Clear 4 ='), '4')
  })

  it('converts to percent', () => {
    assert.equal(display('5 0 %'), '0.50')
  })

  it('maps keyboard keys', () => {
    assert.equal(keyFromKeyboard('Enter'), '=')
    assert.equal(keyFromKeyboard('Escape'), 'Clear')
    assert.equal(keyFromKeyboard('7'), '7')
    assert.equal(keyFromKeyboard('/'), '/')
    assert.equal(keyFromKeyboard('a'), undefined)
    assert.equal(keyFromKeyboard('F5'), undefined)
  })
})
