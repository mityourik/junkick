import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { api, type User } from '../api';
import { setCurrentUser } from '../store/usersSlice';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('джун');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const now = new Date().toISOString();
      const payload: Omit<User, 'id'> = {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        avatar: '',
        skills: [],
        bio: '',
        experience: 0,
        location: '',
        portfolio: '',
        createdAt: now,
      };
      const created = await api.users.create(payload);
      dispatch(setCurrentUser(created));
      localStorage.setItem('currentUser', JSON.stringify(created));
      navigate('/', { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Не удалось зарегистрироваться');
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520, padding: '2rem 0' }}>
      <h1>Регистрация</h1>
      {error && <div style={{ color: 'tomato', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={submit} className="form">
        <div className="form__group">
          <label htmlFor="name">Имя</label>
          <input
            id="name"
            className="input"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div className="form__group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form__row">
          <div className="form__group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form__group">
            <label htmlFor="role">Роль</label>
            <select
              id="role"
              className="input"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="джун">джун</option>
              <option value="тимлид">тимлид</option>
              <option value="заказчик">заказчик</option>
            </select>
          </div>
        </div>
        <div className="form__actions">
          <button className="btn btn--primary">Создать аккаунт</button>
          <Link to="/login" className="btn btn--ghost">
            У меня уже есть аккаунт
          </Link>
        </div>
      </form>
    </div>
  );
}
