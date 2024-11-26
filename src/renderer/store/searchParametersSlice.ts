import type { StoreRootState } from '@/store/store'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type SearchParametersShape = {
  charCount: number
  letters: string[]
  includeNouns: boolean
  includeCompoundNouns: boolean
  includeHypenatedNouns: boolean
  includeAdjectives: boolean
  includeCompoundAdjectives: boolean
}

const initialState: SearchParametersShape = {
  charCount: 9,
  letters: ['', '', '', '', '', '', '', '', ''],
  // For testing:
  // charCount: 14,
  // letters: ['F', '', '', '', '', '', '', '', 'A', '', '', '', '', ''],
  includeNouns: true,
  includeCompoundNouns: false,
  includeHypenatedNouns: false,
  includeAdjectives: true,
  includeCompoundAdjectives: false
}

export const searchParametersSlice = createSlice({
  name: 'searchParameters',
  initialState,
  reducers: {
    updateSearchParameters: (_, action: PayloadAction<SearchParametersShape>) => action.payload
  }
})
export default searchParametersSlice.reducer

// ACTIONS
export const { updateSearchParameters } = searchParametersSlice.actions

// SELECTORS
// Generic selector for use with this slice
export const selectSearchParameters = (state: StoreRootState): SearchParametersShape =>
  state.searchParameters

// export const selectSearchParameters = createSelector(SELECT_STATE, (state) => state)
