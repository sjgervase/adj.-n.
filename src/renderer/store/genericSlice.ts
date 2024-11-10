import type { RootState } from '@/store/store'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export const genericSlice = createSlice({
  name: 'GENERIC_SLICE',
  initialState: [] as string[],
  reducers: {
    addToArray: (state, action: PayloadAction<string>) => {
      state.push(action.payload)
    }
  }
})
export default genericSlice.reducer

// ACTIONS
export const { addToArray } = genericSlice.actions

// SELECTORS
export const selectAll = (state: RootState): unknown => state
