// The calculator's behavior, separate from its UI so it can be tested.

export type Operator = '/' | '*' | '-' | '+' | '='

/** Every input the calculator understands, from either a button or the keyboard. */
export type Key =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | '.' | '%' | '±' | 'Backspace' | 'Clear'
  | Operator

export interface CalculatorState {
  /** The left-hand operand, once an operator has been pressed. */
  value: number | null
  /** Exactly what's on the display, e.g. "12." or "-0.50". */
  displayValue: string
  operator: Operator | null
  /** True right after an operator, when the next digit starts a new number. */
  waitingForOperand: boolean
}

export const initialState: CalculatorState = {
  value: null,
  displayValue: '0',
  operator: null,
  waitingForOperand: false,
}

const ERROR = 'Error'

const operations: Record<Operator, (prevValue: number, nextValue: number) => number> = {
  '/': (prevValue, nextValue) => prevValue / nextValue,
  '*': (prevValue, nextValue) => prevValue * nextValue,
  '+': (prevValue, nextValue) => prevValue + nextValue,
  '-': (prevValue, nextValue) => prevValue - nextValue,
  '=': (_prevValue, nextValue) => nextValue,
}

export function isOperator(key: string): key is Operator {
  return key in operations
}

/** Maps a keyboard event's `key` to a calculator key, if it is one. */
export function keyFromKeyboard(key: string): Key | undefined {
  if (key === 'Enter') return '='
  if (key === 'Escape') return 'Clear'
  if (/^[0-9]$/.test(key) || key === '.' || key === '%' || key === 'Backspace' || key === 'Clear') {
    return key as Key
  }
  if (isOperator(key)) return key
}

/** Whether the clear key will clear just the display ("C") or everything ("AC"). */
export function clearsDisplayOnly(state: CalculatorState): boolean {
  return state.displayValue !== '0'
}

export function press(state: CalculatorState, key: Key): CalculatorState {
  if (key === 'Clear') {
    return clearsDisplayOnly(state) ? { ...state, displayValue: '0' } : initialState
  }

  // After an error, any input starts over.
  if (state.displayValue === ERROR) {
    if (/^[0-9.]$/.test(key)) return press(initialState, key)
    return state
  }

  if (/^[0-9]$/.test(key)) return inputDigit(state, key)
  if (key === '.') return inputDot(state)
  if (key === '%') return inputPercent(state)
  if (key === '±') return toggleSign(state)
  if (key === 'Backspace') return clearLastChar(state)
  return performOperation(state, key as Operator)
}

function inputDigit(state: CalculatorState, digit: string): CalculatorState {
  if (state.waitingForOperand) {
    return { ...state, displayValue: digit, waitingForOperand: false }
  }

  let { displayValue } = state
  if (displayValue === '0') displayValue = digit
  else if (displayValue === '-0') displayValue = `-${digit}`
  else displayValue += digit

  return { ...state, displayValue }
}

function inputDot(state: CalculatorState): CalculatorState {
  // Start a new number after an operator instead of appending to the old one.
  if (state.waitingForOperand) {
    return { ...state, displayValue: '0.', waitingForOperand: false }
  }

  if (state.displayValue.includes('.')) return state
  return { ...state, displayValue: `${state.displayValue}.` }
}

function inputPercent(state: CalculatorState): CalculatorState {
  let currentValue = parseFloat(state.displayValue)
  if (currentValue === 0) return state

  let fixedDigits = state.displayValue.replace(/^-?\d*\.?/, '')
  return { ...state, displayValue: String((currentValue / 100).toFixed(fixedDigits.length + 2)) }
}

function toggleSign(state: CalculatorState): CalculatorState {
  // Flip the sign in the string so "0." and "1.50" keep their dot and zeros.
  let { displayValue } = state
  return {
    ...state,
    displayValue: displayValue.startsWith('-') ? displayValue.slice(1) : `-${displayValue}`,
  }
}

function clearLastChar(state: CalculatorState): CalculatorState {
  // The display holds a computed result, not something the user typed.
  if (state.waitingForOperand) return state

  let displayValue = state.displayValue.slice(0, -1)
  if (displayValue === '' || displayValue === '-') displayValue = '0'

  return { ...state, displayValue }
}

function performOperation(state: CalculatorState, nextOperator: Operator): CalculatorState {
  // Pressing another operator before the next number replaces the operator,
  // instead of applying the previous one to the same number again.
  if (state.waitingForOperand && state.operator !== '=' && nextOperator !== '=') {
    return { ...state, operator: nextOperator }
  }

  let inputValue = parseFloat(state.displayValue)

  if (state.value == null || !state.operator) {
    return { ...state, value: inputValue, operator: nextOperator, waitingForOperand: true }
  }

  let result = operations[state.operator](state.value, inputValue)

  if (!Number.isFinite(result)) {
    return { ...initialState, displayValue: ERROR, waitingForOperand: true }
  }

  // Round away floating-point noise, so 0.1 + 0.2 is 0.3 (not 0.30000000000000004).
  result = parseFloat(result.toPrecision(15))

  return {
    value: result,
    displayValue: String(result),
    operator: nextOperator,
    waitingForOperand: true,
  }
}
