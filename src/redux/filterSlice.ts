import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  enabled: string[];
}

const initialState: FilterState = { enabled: [] };

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    enable(state, action: PayloadAction<string>) {
      state.enabled.push(action.payload);
    },
    disable(state, action: PayloadAction<string>) {
      const index = state.enabled.indexOf(action.payload);
      if (index >= 0) {
        state.enabled.splice(index, 1);
      }
    },
  },
});

export const { enable, disable } = filterSlice.actions;
export default filterSlice.reducer;
