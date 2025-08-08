import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './store/counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})

export type CounterState = ReturnType<typeof counterReducer>
export type RootState = { counter: CounterState }
export type AppDispatch = typeof store.dispatch
