import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
// Здесь будете импортировать другие редьюсеры, например, ingredients, orders и т.д.

const rootReducer = combineReducers({
  user: userReducer
  // ...другие редьюсеры
});

export default rootReducer;
