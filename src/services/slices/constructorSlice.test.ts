import constructorReducer, {
  setBun,
  addMain,
  removeMain,
  moveIngredient,
  clearConstructor,
  initialState
} from './constructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

const testBun: TIngredient = {
  _id: 'bun1',
  name: 'Тестовая булка',
  type: 'bun',
  price: 100,
  image: '',
  image_large: '',
  image_mobile: '',
  proteins: 1,
  fat: 1,
  carbohydrates: 1,
  calories: 1
};
const testMain1: TConstructorIngredient = {
  ...testBun,
  _id: 'main1',
  id: 'uuid1',
  type: 'main'
};
const testMain2: TConstructorIngredient = {
  ...testBun,
  _id: 'main2',
  id: 'uuid2',
  type: 'main'
};

describe('Тестирование редьюсера конструктора', () => {
  it('должен возвращать начальное состояние', () => {
    expect(constructorReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен обрабатывать добавление булки (setBun)', () => {
    const newState = constructorReducer(initialState, setBun(testBun));
    expect(newState.bun).toEqual(testBun);
  });

  it('должен обрабатывать добавление ингредиента (addMain)', () => {
    const action = addMain(testMain1); // prepare-колбэк сам добавит id
    const newState = constructorReducer(initialState, action);

    expect(newState.mains).toHaveLength(1);
    expect(newState.mains[0]).toEqual(
      expect.objectContaining({ _id: 'main1' })
    );
  });

  it('должен обрабатывать удаление ингредиента (removeMain)', () => {
    const filledState = { ...initialState, mains: [testMain1, testMain2] };
    const newState = constructorReducer(filledState, removeMain(testMain1.id));

    expect(newState.mains).toHaveLength(1);
    expect(newState.mains[0].id).toBe('uuid2');
  });

  it('должен обрабатывать перемещение ингредиентов (moveIngredient)', () => {
    const filledState = { ...initialState, mains: [testMain1, testMain2] };
    const newState = constructorReducer(
      filledState,
      moveIngredient({ from: 0, to: 1 })
    );

    expect(newState.mains[0].id).toBe('uuid2');
    expect(newState.mains[1].id).toBe('uuid1');
  });

  it('должен обрабатывать очистку конструктора (clearConstructor)', () => {
    const filledState = { bun: testBun, mains: [testMain1] };
    const newState = constructorReducer(filledState, clearConstructor());
    expect(newState).toEqual(initialState);
  });
});
