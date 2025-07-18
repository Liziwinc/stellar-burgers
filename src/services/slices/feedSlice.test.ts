import feedReducer, { fetchFeeds, initialState } from './feedSlice';
import { TOrdersData } from '@utils-types';

const mockFeeds: TOrdersData = {
  orders: [],
  total: 100,
  totalToday: 10
};

describe('Тестирование редьюсера ленты заказов', () => {
  it('должен обрабатывать состояние ожидания (fetchFeeds.pending)', () => {
    const action = { type: fetchFeeds.pending.type };
    const state = feedReducer(initialState, action);
    expect(state.isLoading).toBe(true);
  });

  it('должен обрабатывать успешное выполнение (fetchFeeds.fulfilled)', () => {
    const action = { type: fetchFeeds.fulfilled.type, payload: mockFeeds };
    const state = feedReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.feeds).toEqual(mockFeeds);
  });
});
