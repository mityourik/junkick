import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { api } from '../api';
import { setCurrentUser } from '../store/usersSlice';

interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface FormErrors {
  [key: string]: string;
}

const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.name || data.name.length < 1) {
    errors.name = 'Имя обязательно';
  } else if (data.name.length > 100) {
    errors.name = 'Имя не должно превышать 100 символов';
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Введите корректный email';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Пароль должен содержать минимум 6 символов';
  }

  if (!data.role || !['разработчик', 'тимлид', 'заказчик'].includes(data.role)) {
    errors.role = 'Выберите роль';
  }

  return errors;
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: 'разработчик',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку поля при изменении
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация формы
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      };

      const response = await api.auth.register(payload);
      dispatch(setCurrentUser(response.user));
      localStorage.setItem('accessToken', response.accessToken);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrors({ general: err.message });
      } else {
        setErrors({ general: 'Не удалось зарегистрироваться' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480, padding: '2rem 0' }}>
      <h1>Регистрация</h1>
      {errors.general && (
        <div style={{ color: 'tomato', marginBottom: '1rem' }}>{errors.general}</div>
      )}
      <form onSubmit={submit} className="form">
        <div className="form__group">
          <label htmlFor="name">Имя</label>
          <input
            id="name"
            className="input"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            disabled={loading}
          />
          {errors.name && <div className="form__error">{errors.name}</div>}
        </div>
        <div className="form__group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="input"
            value={formData.email}
            onChange={e => handleInputChange('email', e.target.value)}
            disabled={loading}
          />
          {errors.email && <div className="form__error">{errors.email}</div>}
        </div>
        <div className="form__group">
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            className="input"
            value={formData.password}
            onChange={e => handleInputChange('password', e.target.value)}
            disabled={loading}
          />
          {errors.password && <div className="form__error">{errors.password}</div>}
        </div>
        <div className="form__group">
          <label htmlFor="role">Роль</label>
          <select
            id="role"
            className="input"
            value={formData.role}
            onChange={e => handleInputChange('role', e.target.value)}
            disabled={loading}
          >
            <option value="разработчик">Разработчик</option>
            <option value="тимлид">Тимлид</option>
            <option value="заказчик">Заказчик</option>
          </select>
          {errors.role && <div className="form__error">{errors.role}</div>}
        </div>
        <div className="form__actions">
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
          <Link to="/login" className="btn btn--ghost">
            У меня уже есть аккаунт
          </Link>
        </div>
      </form>
      <Link to="/" className="projects-page__back">
        ← На главную
      </Link>
    </div>
  );
}
