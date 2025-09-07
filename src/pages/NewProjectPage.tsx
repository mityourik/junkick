import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, type Project } from '../api';

type NewProject = Omit<Project, 'id'>;

export default function NewProjectPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Business',
    lookingFor: '',
    neededRoles: [] as string[],
    tech: '' as string,
    teamSize: 3,
    budget: '',
    timeline: '',
    complexity: 'Средняя',
    image: '',
    ownerId: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    try {
      setSubmitting(true);
      const now = new Date().toISOString();
      const payload: NewProject = {
        name: form.name.trim(),
        description: form.description.trim(),
        status: 'Планирование',
        lookingFor: form.lookingFor.trim() || 'Ищем участников',
        category: form.category,
        tech: form.tech
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        neededRoles: form.neededRoles,
        teamSize: Number(form.teamSize) || 1,
        currentTeam: 1,
        budget: form.budget.trim() || '0',
        timeline: form.timeline.trim() || '1 месяц',
        complexity: form.complexity,
        image: form.image || '/projects/placeholder.jpg',
        features: [],
        requirements: [],
        ownerId: Number(form.ownerId) || 1,
        teamMembers: [],
        createdAt: now,
        updatedAt: now,
      };
      const created = await api.projects.create(payload);
      navigate(`/projects/${created.id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Не удалось создать проект');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container new-project">
      <h1>Новый проект</h1>
      {error && <div className="new-project__error">{error}</div>}
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

        <div className="form__row">
          <div className="form__group">
            <label htmlFor="ownerId">ID владельца</label>
            <input
              id="ownerId"
              type="number"
              min={1}
              value={form.ownerId}
              onChange={e => setForm({ ...form, ownerId: Number(e.target.value) })}
              className="input"
            />
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
        </div>

        <div className="form__actions">
          <button
            className={`btn btn--primary ${submitting ? 'btn--loading' : ''}`}
            disabled={submitting}
          >
            Создать проект
          </button>
          <Link to="/projects" className="btn btn--ghost">
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}
