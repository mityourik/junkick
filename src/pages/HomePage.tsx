import { RoleButtonsList } from '../components/RolesButtonsList';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, type Project } from '../api';
import { ProjectCard } from '../components/ProjectCard';

export const HomePage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params] = useSearchParams();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const response = await api.projects.getAll();
        // API возвращает объект с полем projects, извлекаем массив
        const data = Array.isArray(response) ? response : response.projects || [];
        if (!cancelled) setProjects(data);
      } catch (e) {
        if (!cancelled) setError('Не удалось загрузить проекты: ' + (e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const role = params.get('role');
  const visible = useMemo(() => {
    if (!role) return projects.slice(0, 6);
    return projects.filter(p => p.neededRoles?.some(r => r.toLowerCase() === role.toLowerCase()));
  }, [projects, role]);

  return (
    <div className="homepage">
      <section className="homepage__features">
        <div className="container homepage__features-container">
          <h2 className="text-center">вступай в проекты</h2>
          <div className="homepage__features-grid">
            {loading && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Загрузка...</div>
            )}
            {error && <div style={{ gridColumn: '1 / -1', color: 'tomato' }}>{error}</div>}
            {!loading &&
              !error &&
              visible.map(project => (
                <ProjectCard key={project._id || project.id} project={project} showTeam={false} />
              ))}
          </div>
        </div>
      </section>

      <section className="homepage__hero">
        <div className="container">
          <h1 className="homepage__title">выбери свою роль</h1>
          <RoleButtonsList />
          {role && (
            <div style={{ marginTop: '0.5rem', color: '#666' }}>
              Фильтр по роли: <strong>{role}</strong>
              <Link to="/" style={{ marginLeft: '0.5rem' }}>
                сбросить
              </Link>
            </div>
          )}
          <div style={{ marginTop: '1rem' }}>
            <Link to="/projects" className="btn">
              Смотреть все проекты
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
