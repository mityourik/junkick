import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../store/usersSlice';
import { api } from '../api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  interface LocationState {
    from?: string;
  }
  const from = (location.state as LocationState)?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const user = await api.users.findByEmailPassword(email, password);
      dispatch(setCurrentUser(user));
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ошибка входа');
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480, padding: '2rem 0' }}>
      <h1>Вход</h1>
      {error && <div style={{ color: 'tomato', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit} className="form">
        <div className="form__group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="input"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="form__group">
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            className="input"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="form__actions">
          <button className="btn btn--primary">Войти</button>
          <Link to="/register" className="btn btn--ghost">
            Регистрация
          </Link>
        </div>
      </form>
      <Link to="/" className="projects-page__back">
        ← На главную
      </Link>
    </div>
  );
}
