import rootReducer from './rootReducer';
import { initialState as constructorState } from './slices/constructorSlice';
import { initialState as ingredientsState } from './slices/ingredientsSlice';
import { initialState as userState } from './slices/userSlice';
import { initialState as feedState } from './slices/feedSlice';
import { initialState as ordersState } from './slices/ordersSlice';

describe('Тестирование rootReducer', () => {
  it('должен возвращать начальное состояние для неизвестного экшена', () => {
    const expectedInitialState = {
      user: userState,
      ingredients: ingredientsState,
      burgerConstructor: constructorState,
      feed: feedState,
      orders: ordersState
    };

    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual(expectedInitialState);
  });
});
