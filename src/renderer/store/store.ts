import { configureStore } from '@reduxjs/toolkit'
import searchParametersReducer from './searchParametersSlice'

const store = configureStore({
  reducer: {
    searchParameters: searchParametersReducer
  }
})

export default store

// Infer the "StoreRootState" and "AppDispatch" types from the store itself
export type StoreRootState = ReturnType<typeof store.getState>
export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch
