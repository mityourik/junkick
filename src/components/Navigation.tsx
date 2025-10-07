import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import mainLogo from '../vendor/images/logos/main-logo-transparent.png';
import { selectCurrentUser, clearCurrentUser } from '../store/usersSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { api } from '../api';

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__brand" aria-label="Junkick home">
          <Icon src={mainLogo} size="lg" alt="Junkick" className="icon--logo icon--logo-wide" />
        </Link>

        <ul className="navbar__menu">
          <li>
            <Link to="/" className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}>
              На главную
            </Link>
          </li>
          <li>
            <Link
              to="/projects"
              className={`navbar__link ${isActive('/projects') ? 'navbar__link--active' : ''}`}
            >
              Проекты
            </Link>
          </li>
          {user && (
            <li>
              <Link
                to="/me"
                className={`navbar__link ${isActive('/me') ? 'navbar__link--active' : ''}`}
              >
                Кабинет
              </Link>
            </li>
          )}
          {!user ? (
            <li>
              <Link
                to="/login"
                className={`navbar__link ${isActive('/login') ? 'navbar__link--active' : ''}`}
              >
                Войти
              </Link>
            </li>
          ) : (
            <li>
              <button
                className="btn btn--ghost btn--sm"
                onClick={async () => {
                  try {
                    await api.auth.logout(user.id);
                  } catch (err) {
                    console.warn('Logout tracking failed', err);
                  }
                  localStorage.removeItem('accessToken');
                  dispatch(clearCurrentUser());
                  navigate('/login');
                }}
              >
                Выйти
              </button>
            </li>
          )}
        </ul>

        <button className="navbar__toggle">
          <Icon name="menu" size="md" />
        </button>
      </div>
    </nav>
  );
};
