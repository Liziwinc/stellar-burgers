import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import feedReducer from './slices/feedSlice';
import ordersReducer from './slices/ordersSlice';

const rootReducer = combineReducers({
  user: userReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  feed: feedReducer,
  orders: ordersReducer
});

export default rootReducer;
