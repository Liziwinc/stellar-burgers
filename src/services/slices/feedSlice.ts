import {
  createSlice,
  createAsyncThunk,
  SerializedError
} from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrdersData } from '@utils-types';

export const fetchFeeds = createAsyncThunk<TOrdersData>(
  'feed/fetchAll',
  async () => {
    const feeds = await getFeedsApi();
    return feeds;
  }
);

type TFeedState = {
  feeds: TOrdersData;
  isLoading: boolean;
  error: SerializedError | null;
};

export const initialState: TFeedState = {
  feeds: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  isLoading: false,
  error: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feeds = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  }
});

export default feedSlice.reducer;
