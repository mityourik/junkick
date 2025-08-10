import { Link, useLocation } from 'react-router-dom';
import Icon from './Icon';
import mainLogo from '../vendor/images/logos/main-logo-transparent.png';

export default function Navigation() {
  const location = useLocation();

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
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/projects"
              className={`navbar__link ${isActive('/projects') ? 'navbar__link--active' : ''}`}
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className={`navbar__link ${isActive('/login') ? 'navbar__link--active' : ''}`}
            >
              Login
            </Link>
          </li>
        </ul>

        <button className="navbar__toggle">
          <Icon name="menu" size="md" />
        </button>
      </div>
    </nav>
  );
}
