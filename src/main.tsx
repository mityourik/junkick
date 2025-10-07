import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './App.tsx';
import './scss/main.scss';
import { store } from './store';
import { setCurrentUser } from './store/usersSlice';
import { api } from './api';

const restoreAuth = async () => {
  try {
    const raw = localStorage.getItem('currentUser');
    const token = localStorage.getItem('accessToken');

    if (raw && token) {
      const user = JSON.parse(raw);

      if (user && (user.id || user._id) && user.email && user.name) {
        try {
          const validatedUser = await api.auth.validateUser(user._id || user.id);

          if (validatedUser) {
            store.dispatch(setCurrentUser(validatedUser));
          } else {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('accessToken');
          }
        } catch (error) {
          store.dispatch(setCurrentUser(user));
        }
      } else {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('accessToken');
      }
    } else if (raw && !token) {
      localStorage.removeItem('currentUser');
    }
  } catch (error) {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
  }
};

restoreAuth();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
