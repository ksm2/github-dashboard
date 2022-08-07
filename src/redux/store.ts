import { configureStore, Middleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import filterSlice from '~/redux/filterSlice.js';
import { api } from './apiSlice.js';

const queryParamMiddleware: Middleware = (store) => (next) => (action) => {
  const state = next(action);
  if (action.type === 'filter/enable' || action.type === 'filter/disable') {
    const enabledFilters = store.getState().filter.enabled;
    const href = new URL(location.href);
    href.searchParams.delete('filters');
    for (const enabledFilter of enabledFilters) {
      href.searchParams.append('filters', enabledFilter);
    }
    history.pushState({}, '', href.toString());
  }
  return state;
};

export const store = configureStore({
  reducer: {
    filter: filterSlice,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, queryParamMiddleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
