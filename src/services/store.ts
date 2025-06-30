// import { configureStore } from '@reduxjs/toolkit';

// import {
//   TypedUseSelectorHook,
//   useDispatch as dispatchHook,
//   useSelector as selectorHook
// } from 'react-redux';

// const rootReducer = () => {}; // Заменить на импорт настоящего редьюсера

// const store = configureStore({
//   reducer: rootReducer,
//   devTools: process.env.NODE_ENV !== 'production'
// });

// export type RootState = ReturnType<typeof rootReducer>;

// export type AppDispatch = typeof store.dispatch;

// export const useDispatch: () => AppDispatch = () => dispatchHook();
// export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

// export default store;
import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import rootReducer from './rootReducer'; // Импортируем наш настоящий rootReducer

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
