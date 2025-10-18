import ordersReducer, {
  createNewOrder,
  fetchUserOrders,
  fetchOrderByNumber,
  clearNewOrder,
  initialState
} from './ordersSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: '1',
  number: 123,
  status: 'done',
  name: 'Test Order',
  createdAt: '',
  updatedAt: '',
  ingredients: []
};

describe('Тестирование редьюсера заказов', () => {
  it('должен обрабатывать очистку нового заказа (clearNewOrder)', () => {
    const filledState = { ...initialState, newOrder: mockOrder };
    const newState = ordersReducer(filledState, clearNewOrder());
    expect(newState.newOrder).toBeNull();
  });

  // Тесты для createNewOrder
  describe('Асинхронное создание заказа', () => {
    it('should handle pending state for createNewOrder', () => {
      const action = { type: createNewOrder.pending.type };
      const state = ordersReducer(initialState, action);
      expect(state.status).toBe('loading');
    });

    it('should handle fulfilled state for createNewOrder', () => {
      const action = {
        type: createNewOrder.fulfilled.type,
        payload: { order: mockOrder }
      };
      const state = ordersReducer(initialState, action);
      expect(state.status).toBe('succeeded');
      expect(state.newOrder).toEqual(mockOrder);
    });
  });

  // Тесты для fetchUserOrders
  it('должен обрабатывать успешное получение заказов пользователя (fetchUserOrders.fulfilled)', () => {
    const action = {
      type: fetchUserOrders.fulfilled.type,
      payload: [mockOrder]
    };
    const state = ordersReducer(initialState, action);
    expect(state.userOrders).toEqual([mockOrder]);
  });
});
