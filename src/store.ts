import { configureStore, type Middleware } from '@reduxjs/toolkit';
import projectsReducer from './store/projectsSlice';
import usersReducer, { setCurrentUser, clearCurrentUser } from './store/usersSlice';

const localStorageMiddleware: Middleware = _store => next => (action: any) => {
  const result = next(action);

  if (action.type === setCurrentUser.type) {
    const user = action.payload;
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user to localStorage:', error);
    }
  } else if (action.type === clearCurrentUser.type) {
    try {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('accessToken');
    } catch (error) {
      console.error('Failed to remove user from localStorage:', error);
    }
  }

  return result;
};

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    users: usersReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
