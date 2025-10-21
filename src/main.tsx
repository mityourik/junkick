import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './App.tsx';
import './scss/main.scss';
import { store } from './store';
import { setCurrentUser, clearCurrentUser } from './store/usersSlice';
import { api } from './api';

const restoreAuth = () => {
  try {
    const raw = localStorage.getItem('currentUser');
    const token = localStorage.getItem('accessToken');

    if (raw && token) {
      const user = JSON.parse(raw);

      if (user && (user.id || user._id) && user.email && user.name) {
        store.dispatch(setCurrentUser(user));

        api.auth
          .validateUser(user._id || user.id)
          .then(validatedUser => {
            if (validatedUser) {
              const mergedUser = {
                ...user,
                ...validatedUser,
                github_link: validatedUser.github_link || user.github_link || '',
                experience: validatedUser.experience || user.experience || 0,
              };
              store.dispatch(setCurrentUser(mergedUser));
            } else {
              localStorage.removeItem('currentUser');
              localStorage.removeItem('accessToken');
              store.dispatch(clearCurrentUser());
            }
          })
          .catch(() => {});
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
