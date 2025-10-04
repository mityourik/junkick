import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './store/projectsSlice';
import usersReducer from './store/usersSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
