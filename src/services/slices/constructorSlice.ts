import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type TConstructorState = {
  bun: TIngredient | null;
  mains: TConstructorIngredient[];
};

export const initialState: TConstructorState = {
  bun: null,
  mains: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addMain: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.mains.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    removeMain: (state, action: PayloadAction<string>) => {
      state.mains = state.mains.filter((item) => item.id !== action.payload);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      const [movedItem] = state.mains.splice(from, 1);
      state.mains.splice(to, 0, movedItem);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.mains = [];
    }
  }
});

export const { setBun, addMain, removeMain, moveIngredient, clearConstructor } =
  constructorSlice.actions;
export default constructorSlice.reducer;
