// redux/planSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PlanState = {
  currentPlanId: string | null;
};

const initialState: PlanState = {
  currentPlanId: null,
};

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    setPlanId: (state, action: PayloadAction<string>) => {
      state.currentPlanId = action.payload;
    },
    clearPlanId: (state) => {
      state.currentPlanId = null;
    },
  },
});

export const { setPlanId, clearPlanId } = planSlice.actions;

export default planSlice.reducer;
