import {
  createSlice,
  createAsyncThunk,
  SerializedError
} from '@reduxjs/toolkit';
import {
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '../../utils/burger-api';
import { TOrder } from '@utils-types';

export const createNewOrder = createAsyncThunk(
  'orders/create',
  async (ingredientIds: string[]) => orderBurgerApi(ingredientIds)
);

export const fetchUserOrders = createAsyncThunk<TOrder[]>(
  'orders/fetchUserOrders',
  async () => getOrdersApi()
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'orders/fetchByNumber',
  async (orderNumber) => {
    const result = await getOrderByNumberApi(orderNumber);
    return result.orders[0];
  }
);

type TOrdersState = {
  userOrders: TOrder[];
  currentOrder: TOrder | null;
  newOrder: TOrder | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: SerializedError | null;
};

export const initialState: TOrdersState = {
  userOrders: [],
  currentOrder: null,
  newOrder: null,
  status: 'idle',
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearNewOrder: (state) => {
      state.newOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.newOrder = action.payload.order;
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.status = 'loading';
        state.currentOrder = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
      });
  }
});

export const { clearNewOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
