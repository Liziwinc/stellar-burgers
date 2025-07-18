import userReducer, {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser,
  setAuthChecked,
  initialState
} from './userSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = { name: 'Test User', email: 'test@test.com' };

describe('Тестирование редьюсера пользователя', () => {
  it('должен устанавливать флаг проверки авторизации (setAuthChecked)', () => {
    const newState = userReducer(initialState, setAuthChecked(true));
    expect(newState.isAuthChecked).toBe(true);
  });

  // Тестирование registerUser
  describe('Асинхронная регистрация пользователя', () => {
    it('должен обрабатывать состояние ожидания (registerUser.pending)', () => {
      const action = { type: registerUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(true);
    });

    it('должен обрабатывать успешное выполнение (registerUser.fulfilled)', () => {
      const action = { type: registerUser.fulfilled.type, payload: mockUser };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен обрабатывать ошибку (registerUser.rejected)', () => {
      const error = { message: 'Registration failed' };
      const action = { type: registerUser.rejected.type, error };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(error.message);
    });
  });

  // Тестирование loginUser
  describe('Асинхронный логин пользователя', () => {
    it('должен обрабатывать успешное выполнение (loginUser.fulfilled)', () => {
      const action = { type: loginUser.fulfilled.type, payload: mockUser };
      const state = userReducer(initialState, action);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  // Тестирование logoutUser
  it('должен обрабатывать выход из системы (logoutUser.fulfilled)', () => {
    const filledState = { ...initialState, user: mockUser };
    const action = { type: logoutUser.fulfilled.type };
    const state = userReducer(filledState, action);
    expect(state.user).toBeNull();
  });

  // Тестирование updateUser
  it('должен обрабатывать обновление данных пользователя (updateUser.fulfilled)', () => {
    const updatedUser = { ...mockUser, name: 'Updated Name' };
    const action = { type: updateUser.fulfilled.type, payload: updatedUser };
    const state = userReducer(initialState, action);
    expect(state.user).toEqual(updatedUser);
  });
});
