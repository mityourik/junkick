import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type CounterState = {
  value: number
}

const initialState: CounterState = { value: 0 }

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.value += 1
    },
    decrement(state) {
      state.value -= 1
    },
    addBy(state, action: PayloadAction<number>) {
      state.value += action.payload
    },
    reset() {
      return initialState
    },
  },
})

export const { increment, decrement, addBy, reset } = counterSlice.actions
export default counterSlice.reducer

// Selectors
export const selectCounterValue = (state: import('../store').RootState) => state.counter.value
