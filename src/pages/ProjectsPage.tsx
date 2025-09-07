import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { api, type Project } from '../api';
import { ProjectCard } from '../components/ProjectCard';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params] = useSearchParams();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const projectsData = await api.projects.getAll();
        if (!cancelled) setProjects(projectsData);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError('Не удалось загрузить проекты');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const role = params.get('role');
    if (!role) return projects;
    return projects.filter(p => p.neededRoles?.some(r => r.toLowerCase() === role.toLowerCase()));
  }, [params, projects]);

  if (loading) {
    return (
      <div className="container projects-page projects-page--centered">
        <h2>Загрузка проектов...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container projects-page">
        <h2>Ошибка</h2>
        <p>{error}</p>
        <Link to="/">На главную</Link>
      </div>
    );
  }

  return (
    <div className="container projects-page">
      <h1>Проекты</h1>
      {params.get('role') && (
        <div className="projects-page__filter">
          Фильтр по роли: <strong>{params.get('role')}</strong>{' '}
          <Link to="/projects" className="projects-page__reset">
            сбросить
          </Link>
        </div>
      )}
      <div className="projects-page__grid">
        {filtered.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <Link to="/" className="projects-page__back">
        ← На главную
      </Link>
    </div>
  );
}
