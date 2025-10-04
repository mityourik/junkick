import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, type Project } from '../api';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/usersSlice';

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Business',
    lookingFor: '',
    neededRoles: [] as string[],
    tech: '' as string,
    teamSize: 1,
    currentTeam: 1,
    budget: '',
    timeline: '',
    complexity: 'Средняя',
    image: '',
    status: 'Планирование',
  });

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError('Invalid project id');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await api.projects.getById(id);
        setProject(data);
        setForm({
          name: data.name,
          description: data.description,
          category: data.category,
          lookingFor: data.lookingFor,
          neededRoles: data.neededRoles || [],
          tech: (data.tech || []).join(', '),
          teamSize: data.teamSize,
          currentTeam: data.currentTeam,
          budget: data.budget,
          timeline: data.timeline,
          complexity: data.complexity,
          image: data.image,
          status: data.status,
        });
      } catch (e) {
        setError((e as Error).message || 'Не удалось загрузить проект');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const isOwner = useMemo(() => {
    if (!project || !currentUser) return false;
    return String(project.ownerId) === String(currentUser.id);
  }, [project, currentUser]);

  const toggleRole = (role: string) => {
    setForm(prev => ({
      ...prev,
      neededRoles: prev.neededRoles.includes(role)
        ? prev.neededRoles.filter(r => r !== role)
        : [...prev.neededRoles, role],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !project) return;
    if (!isOwner) {
      setError('У вас нет прав на редактирование этого проекта');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const payload: Partial<Project> = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        lookingFor: form.lookingFor.trim(),
        neededRoles: form.neededRoles,
        tech: form.tech
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        teamSize: Number(form.teamSize) || 1,
        currentTeam: Number(form.currentTeam) || 1,
        budget: form.budget.trim(),
        timeline: form.timeline.trim(),
        complexity: form.complexity,
        image: form.image,
        status: form.status,
        updatedAt: new Date().toISOString(),
      };
      const updated = await api.projects.update(project._id || project.id!, payload);
      navigate(`/projects/${updated.id}`);
    } catch (e) {
      setError((e as Error).message || 'Не удалось сохранить изменения');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container new-project">
        <h2>Загрузка...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container new-project">
        <h2>Ошибка</h2>
        <p>{error}</p>
        <Link to={project ? `/projects/${project.id}` : '/projects'} className="btn">
          Назад
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container new-project">
        <h2>Проект не найден</h2>
        <Link to="/projects" className="btn">
          К списку проектов
        </Link>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="container new-project">
        <h2>Нет доступа</h2>
        <p>Редактировать проект может только владелец.</p>
        <Link to={`/projects/${project.id}`} className="btn">
          Вернуться к проекту
        </Link>
      </div>
    );
  }

  return (
    <div className="container new-project">
      <h1>Редактирование проекта</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form__group">
          <label htmlFor="name">Название</label>
          <input
            id="name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="input"
            required
          />
        </div>

        <div className="form__group">
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="input"
            rows={4}
            required
          />
        </div>

        <div className="form__row">
          <div className="form__group">
            <label htmlFor="category">Категория</label>
            <select
              id="category"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="input"
            >
              <option>Business</option>
              <option>E-commerce</option>
              <option>Mobile</option>
              <option>Social</option>
              <option>Education</option>
            </select>
          </div>
          <div className="form__group">
            <label htmlFor="status">Статус</label>
            <select
              id="status"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="input"
            >
              <option>Планирование</option>
              <option>В работе</option>
              <option>На паузе</option>
              <option>Готово</option>
            </select>
          </div>
        </div>

        <div className="form__group">
          <label>Нужные роли</label>
          <div className="form__chips">
            {['джун', 'тимлид', 'заказчик'].map(role => (
              <label
                key={role}
                className={`chip ${form.neededRoles.includes(role) ? 'chip--active' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={form.neededRoles.includes(role)}
                  onChange={() => toggleRole(role)}
                />
                {role}
              </label>
            ))}
          </div>
        </div>

        <div className="form__group">
          <label htmlFor="lookingFor">Кого ищем</label>
          <input
            id="lookingFor"
            value={form.lookingFor}
            onChange={e => setForm({ ...form, lookingFor: e.target.value })}
            className="input"
          />
        </div>

        <div className="form__group">
          <label htmlFor="tech">Технологии (через запятую)</label>
          <input
            id="tech"
            value={form.tech}
            onChange={e => setForm({ ...form, tech: e.target.value })}
            className="input"
          />
        </div>

        <div className="form__row">
          <div className="form__group">
            <label htmlFor="teamSize">Размер команды</label>
            <input
              id="teamSize"
              type="number"
              min={1}
              value={form.teamSize}
              onChange={e => setForm({ ...form, teamSize: Number(e.target.value) })}
              className="input"
            />
          </div>
          <div className="form__group">
            <label htmlFor="currentTeam">Сейчас в команде</label>
            <input
              id="currentTeam"
              type="number"
              min={1}
              value={form.currentTeam}
              onChange={e => setForm({ ...form, currentTeam: Number(e.target.value) })}
              className="input"
            />
          </div>
        </div>

        <div className="form__row">
          <div className="form__group">
            <label htmlFor="budget">Бюджет (₽)</label>
            <input
              id="budget"
              value={form.budget}
              onChange={e => setForm({ ...form, budget: e.target.value })}
              className="input"
            />
          </div>
          <div className="form__group">
            <label htmlFor="timeline">Срок</label>
            <input
              id="timeline"
              value={form.timeline}
              onChange={e => setForm({ ...form, timeline: e.target.value })}
              className="input"
            />
          </div>
        </div>

        <div className="form__group">
          <label htmlFor="image">Изображение (URL)</label>
          <input
            id="image"
            value={form.image}
            onChange={e => setForm({ ...form, image: e.target.value })}
            className="input"
          />
        </div>

        <div className="form__actions">
          <button className={`btn btn--primary ${saving ? 'btn--loading' : ''}`} disabled={saving}>
            Сохранить изменения
          </button>
          <Link to={`/projects/${project.id}`} className="btn btn--ghost">
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}
