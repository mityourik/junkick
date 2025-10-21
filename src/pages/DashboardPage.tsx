import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { api, type Project, type User } from '../api';
import { selectCurrentUser, setCurrentUser } from '../store/usersSlice';
import { ProjectCard } from '../components/ProjectCard';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [memberProjects, setMemberProjects] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    location: '',
    bio: '',
    skills: '' as string,
    experience: 0,
    github_link: '',
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      location: user.location || '',
      bio: user.bio || '',
      skills: user.skills || '',
      experience: user.experience || 0,
      github_link: user.github_link || '',
    });
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) return;
      const userId = user._id || user.id;
      if (!userId) {
        console.warn('User ID is missing:', user);
        return;
      }

      try {
        const response = await api.projects.getByOwner(userId);
        const owned = Array.isArray(response)
          ? response
          : (response as { projects?: Project[] }).projects || [];
        if (!cancelled) setMyProjects(owned);
      } catch {
        if (!cancelled) setMyProjects([]);
      }

      try {
        const response = await api.projects.getAll();
        const all = Array.isArray(response)
          ? response
          : (response as { projects?: Project[] }).projects || [];
        const asMember = all.filter(p => p.teamMembers?.some(id => String(id) === String(user.id)));
        if (!cancelled) setMemberProjects(asMember);
      } catch {
        if (!cancelled) setMemberProjects([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

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
        location: form.location.trim(),
        bio: form.bio.trim(),
        skills: form.skills.trim(),
        experience: form.experience,
        github_link: form.github_link.trim(),
      };
      const updated = await api.users.update(user._id || user.id!, patch);
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
                <input
                  id="role"
                  className="input"
                  value={user.role || ''}
                  disabled
                  style={{ backgroundColor: '#f5f5f5', color: '#666' }}
                />
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
                <label htmlFor="github_link">GitHub</label>
                <input
                  id="github_link"
                  className="input"
                  value={form.github_link}
                  onChange={e => setForm({ ...form, github_link: e.target.value })}
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="form__group">
                <label htmlFor="experience">Опыт (лет)</label>
                <input
                  id="experience"
                  type="number"
                  min="0"
                  max="50"
                  className="input"
                  value={form.experience}
                  onChange={e => setForm({ ...form, experience: parseInt(e.target.value) || 0 })}
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
                <div key={p._id || p.id}>
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
                          await api.projects.delete(p._id || p.id!);
                          setMyProjects(prev =>
                            prev.filter(x => String(x._id || x.id) !== String(p._id || p.id)),
                          );
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
                <ProjectCard key={p._id || p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
