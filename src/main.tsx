import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './App.tsx';
import './scss/main.scss';
import { store } from './store';
import { setCurrentUser } from './store/usersSlice';

// Theme follows system via CSS `prefers-color-scheme`; no JS needed.

try {
  const raw = localStorage.getItem('currentUser');
  if (raw) {
    const user = JSON.parse(raw);
    if (user && user.id) store.dispatch(setCurrentUser(user));
  }
} catch {
  // Пока ничего
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
