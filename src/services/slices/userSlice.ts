import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import { TRegisterData, TLoginData } from '../../utils/burger-api';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

// Типизация состояния
interface TUserState {
  isAuthChecked: boolean;
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
}

// Начальное состояние
export const initialState: TUserState = {
  isAuthChecked: false, // Флаг для проверки, завершился ли первоначальный запрос на получение пользователя
  user: null,
  isLoading: false,
  error: null
};

// Асинхронные Thunks
export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const getUser = createAsyncThunk(
  'user/get',
  async () => await getUserApi().then((res) => res.user)
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) =>
    await updateUserApi(data).then((res) => res.user)
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

// Создание слайса
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Редьюсер для установки флага проверки авторизации
    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Общие состояния загрузки
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      // Обработка ошибок
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch user';
        state.isAuthChecked = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Update failed';
      })

      // Успешное выполнение
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      });
  }
});

export const { setAuthChecked } = userSlice.actions;
export default userSlice.reducer;
