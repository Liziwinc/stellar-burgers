import ingredientsReducer, {
  fetchIngredients,
  initialState
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Test Bun',
    type: 'bun',
    price: 100,
    image: '',
    image_large: '',
    image_mobile: '',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1
  }
];

describe('Тестирование редьюсера ингредиентов', () => {
  it('должен обрабатывать состояние ожидания (fetchIngredients.pending)', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать успешное выполнение (fetchIngredients.fulfilled)', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('должен обрабатывать ошибку выполнения (fetchIngredients.rejected)', () => {
    const error = new Error('Test Error');
    const action = { type: fetchIngredients.rejected.type, error };
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toEqual(error);
  });
});
