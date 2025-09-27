import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { api, type Project, type Role as RoleDef, type User } from '../api';
import { selectCurrentUser, setCurrentUser } from '../store/usersSlice';
import { ProjectCard } from '../components/ProjectCard';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [roles, setRoles] = useState<RoleDef[]>([]);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [memberProjects, setMemberProjects] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    role: '',
    location: '',
    bio: '',
    skills: '' as string,
    portfolio: '',
  });

  useEffect(() => {
    // Временно используем статический список ролей
    setRoles([
      {
        id: 'junior',
        name: 'Джун',
        description: 'Начинающий разработчик',
        variant: 'outline',
        color: '#2c91dc',
      },
      {
        id: 'middle',
        name: 'Мидл',
        description: 'Разработчик среднего уровня',
        variant: 'primary',
        color: '#27ae60',
      },
      {
        id: 'senior',
        name: 'Синьор',
        description: 'Опытный разработчик',
        variant: 'secondary',
        color: '#f39c12',
      },
      {
        id: 'teamlead',
        name: 'Тимлид',
        description: 'Руководитель команды',
        variant: 'ghost',
        color: '#e74c3c',
      },
      {
        id: 'client',
        name: 'Заказчик',
        description: 'Заказчик проекта',
        variant: 'success',
        color: '#9b59b6',
      },
    ]);
  }, []);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      role: user.role || '',
      location: user.location || '',
      bio: user.bio || '',
      skills: (user.skills || []).join(', '),
      portfolio: user.portfolio || '',
    });
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) return;

      const userId = user.customId || user.id;
      if (!userId) return;

      try {
        const owned = await api.projects.getByOwner(userId);
        if (!cancelled) setMyProjects(owned);
      } catch {
        if (!cancelled) setMyProjects([]);
      }

      try {
        const response = await api.projects.getAll();
        const all = Array.isArray(response) ? response : response.projects || [];
        const asMember = all.filter(p => p.teamMembers?.some(id => String(id) === String(userId)));
        if (!cancelled) setMemberProjects(asMember);
      } catch {
        if (!cancelled) setMemberProjects([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const roleOptions = useMemo(
    () => (roles.length ? roles.map(r => r.name) : ['джун', 'тимлид', 'заказчик']),
    [roles],
  );

  if (!user) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <h2>Требуется вход</h2>
        <Link to="/login" className="btn">
          Войти
        </Link>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const patch: Partial<User> = {
        name: form.name.trim(),
        role: form.role,
        location: form.location.trim(),
        bio: form.bio.trim(),
        skills: form.skills
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        portfolio: form.portfolio.trim(),
      };
      const updated = await api.users.update(Number(user.id), patch);
      dispatch(setCurrentUser(updated));
      try {
        localStorage.setItem('currentUser', JSON.stringify(updated));
      } catch (err) {
        console.debug('localStorage is unavailable for persisting currentUser', err);
      }
    } catch (e) {
      setError((e as Error).message || 'Не удалось сохранить профиль');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: '1.5rem 0' }}>
      <h1>Личный кабинет</h1>

      <section className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card__header">
          <h3>Профиль</h3>
        </div>
        <div className="card__body">
          {error && <div style={{ color: 'tomato', marginBottom: '0.75rem' }}>{error}</div>}
          <form onSubmit={handleSave} className="form">
            <div className="form__row">
              <div className="form__group">
                <label htmlFor="name">Имя</label>
                <input
                  id="name"
                  className="input"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form__group">
                <label htmlFor="role">Роль</label>
                <select
                  id="role"
                  className="input"
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                >
                  {roleOptions.map(r => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form__row">
              <div className="form__group">
                <label htmlFor="location">Локация</label>
                <input
                  id="location"
                  className="input"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div className="form__group">
                <label htmlFor="portfolio">Портфолио</label>
                <input
                  id="portfolio"
                  className="input"
                  value={form.portfolio}
                  onChange={e => setForm({ ...form, portfolio: e.target.value })}
                />
              </div>
            </div>
            <div className="form__group">
              <label htmlFor="skills">Навыки (через запятую)</label>
              <input
                id="skills"
                className="input"
                value={form.skills}
                onChange={e => setForm({ ...form, skills: e.target.value })}
              />
            </div>
            <div className="form__group">
              <label htmlFor="bio">О себе</label>
              <textarea
                id="bio"
                className="input"
                rows={3}
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
              />
            </div>
            <div className="form__actions">
              <button
                className={`btn btn--primary ${saving ? 'btn--loading' : ''}`}
                disabled={saving}
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card__header">
          <h3>Мои проекты</h3>
          <Link to="/projects/new" className="btn btn--sm btn--ghost">
            Новый проект
          </Link>
        </div>
        <div className="card__body">
          {myProjects.length === 0 ? (
            <div>У вас пока нет проектов.</div>
          ) : (
            <div className="projects-page__grid">
              {myProjects.map(p => (
                <div key={p.id}>
                  <ProjectCard project={p} />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <Link to={`/projects/${p.id}/edit`} className="btn btn--sm">
                      Редактировать
                    </Link>
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={async () => {
                        if (!window.confirm('Удалить проект?')) return;
                        try {
                          await api.projects.delete(p.id);
                          setMyProjects(prev => prev.filter(x => String(x.id) !== String(p.id)));
                        } catch (err) {
                          alert('Не удалось удалить: ' + (err as Error).message);
                        }
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="card">
        <div className="card__header">
          <h3>Участвую в командах</h3>
        </div>
        <div className="card__body">
          {memberProjects.length === 0 ? (
            <div>Пока нет участия в проектах.</div>
          ) : (
            <div className="projects-page__grid">
              {memberProjects.map(p => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
