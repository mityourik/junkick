import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api, type Project, type User } from '../api';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/usersSlice';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyName, setApplyName] = useState('');
  const [applyRole, setApplyRole] = useState('джун');
  const [applyMessage, setApplyMessage] = useState('');
  const [applySuccess, setApplySuccess] = useState<string | null>(null);
  const currentUser = useSelector(selectCurrentUser);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) {
        setError('Invalid project ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const projectData = await api.projects.getById(id);
        setProject(projectData);

        const ownerId =
          typeof projectData.ownerId === 'object' ? projectData.ownerId._id : projectData.ownerId;
        const ownerData = await api.users.getById(ownerId);
        setOwner(ownerData);

        if (projectData.teamMembers.length > 0) {
          const membersPromises = projectData.teamMembers.map(memberId =>
            api.users.getById(memberId),
          );
          const membersData = await Promise.all(membersPromises);
          setTeamMembers(membersData);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  if (loading) {
    return (
      <div className="container project-detail project-detail--centered">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container project-detail">
        <h1>Project Not Found</h1>
        <p>{error || 'The requested project could not be found.'}</p>
        <Link to="/projects">← Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="container project-detail">
      <div className="card card--no-border">
        <div className="card__header">
          <div className="card__header-top">
            <div>
              <span className="card__status">{project.status}</span>
              <span className="card__header-wanted-roles">{project.lookingFor}</span>
            </div>
            <div className="card__header-meta">
              <div>
                Команда: {project.currentTeam}/{project.teamSize}
              </div>
              <div>Бюджет: {project.budget}₽</div>
              <div>Срок: {project.timeline}</div>
            </div>
          </div>
        </div>

        <div className="card__body">
          <h1 className="project-detail__title">{project.name}</h1>
          <p className="project-detail__description">{project.description}</p>

          <div className="project-detail__sections">
            <div>
              <h3>Technologies Used</h3>
              <div className="project-detail__tech-list">
                {project.tech.map((tech, index) => (
                  <span key={index} className="project-detail__tech">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3>Key Features</h3>
              <ul className="project-detail__list">
                {project.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Requirements</h3>
              <ul className="project-detail__list">
                {project.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Project Owner</h3>
              {owner && (
                <div className="project-detail__owner">
                  <div>
                    <div className="project-detail__owner-name">{owner.name}</div>
                    <div className="project-detail__owner-meta">
                      {owner.role} • {owner.location}
                    </div>
                    <div className="project-detail__owner-bio">{owner.bio}</div>
                  </div>
                </div>
              )}
            </div>

            {teamMembers.length > 0 && (
              <div>
                <h3>Team Members</h3>
                <div className="project-detail__team">
                  {teamMembers.map(member => (
                    <div key={member.id} className="project-detail__team-item">
                      <div>
                        <div className="project-detail__team-name">{member.name}</div>
                        <div className="project-detail__team-meta">
                          {member.role} • {member.skills.slice(0, 3).join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3>Оставить заявку на участие</h3>
              {applySuccess && <div className="apply-form__success">{applySuccess}</div>}
              <form
                className="apply-form"
                onSubmit={async e => {
                  e.preventDefault();
                  try {
                    setApplySuccess(null);
                    await api.applications.create({
                      projectId: project?._id || project?.id || id!,
                      name: applyName.trim(),
                      role: applyRole,
                      message: applyMessage.trim(),
                      createdAt: new Date().toISOString(),
                    });
                    setApplySuccess('Заявка отправлена');
                    setApplyName('');
                    setApplyMessage('');
                  } catch (err) {
                    setApplySuccess('Не удалось отправить заявку: ' + (err as Error).message);
                  }
                }}
              >
                <div className="apply-form__row">
                  <div className="apply-form__group">
                    <label htmlFor="apply-name">Ваше имя</label>
                    <input
                      id="apply-name"
                      className="input"
                      value={applyName}
                      onChange={e => setApplyName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="apply-form__group">
                    <label htmlFor="apply-role">Роль</label>
                    <select
                      id="apply-role"
                      className="input"
                      value={applyRole}
                      onChange={e => setApplyRole(e.target.value)}
                    >
                      <option value="джун">джун</option>
                      <option value="тимлид">тимлид</option>
                      <option value="заказчик">заказчик</option>
                    </select>
                  </div>
                </div>
                <div className="apply-form__group">
                  <label htmlFor="apply-message">Сообщение</label>
                  <textarea
                    id="apply-message"
                    className="input"
                    rows={3}
                    value={applyMessage}
                    onChange={e => setApplyMessage(e.target.value)}
                  />
                </div>
                <div className="apply-form__actions">
                  <button className="btn btn--primary">Отправить заявку</button>
                  <Link to="/projects" className="btn btn--ghost">
                    К списку проектов
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="card__footer project-detail__footer">
          <Link to="/projects">← Back to Projects</Link>
          {currentUser && String(currentUser.id) === String(project.ownerId) && (
            <>
              <Link to={`/projects/${project.id}/edit`}>Редактировать</Link>
              <button
                className={`btn btn--danger btn--sm ${deleting ? 'btn--loading' : ''}`}
                disabled={deleting}
                onClick={async () => {
                  if (!window.confirm('Удалить проект? Действие необратимо.')) return;
                  try {
                    setDeleting(true);
                    await api.projects.delete(project._id || project.id!);
                    navigate('/projects');
                  } catch (err) {
                    alert('Не удалось удалить проект: ' + (err as Error).message);
                  } finally {
                    setDeleting(false);
                  }
                }}
              >
                Удалить
              </button>
            </>
          )}
          <Link to="/">На главную</Link>
        </div>
      </div>
    </div>
  );
}
