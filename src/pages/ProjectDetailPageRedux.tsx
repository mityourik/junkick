import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchProjectById,
  selectCurrentProject,
  selectProjectsLoading,
  selectProjectsError,
  clearCurrentProject,
} from '../store/projectsSlice';
import {
  fetchUserById,
  selectUserById,
  selectTeamMembers,
  selectUsersLoading,
} from '../store/usersSlice';

export default function ProjectDetailPageRedux() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // Селекторы Redux
  const project = useAppSelector(selectCurrentProject);
  const projectsLoading = useAppSelector(selectProjectsLoading);
  const projectsError = useAppSelector(selectProjectsError);
  const usersLoading = useAppSelector(selectUsersLoading);
  const teamMembers = useAppSelector(selectTeamMembers);

  // Получаем владельца проекта из кеша
  const owner = useAppSelector(state => (project ? selectUserById(project.ownerId)(state) : null));

  useEffect(() => {
    const loadProject = async () => {
      if (!id || isNaN(Number(id))) return;

      // Очищаем текущий проект при смене ID
      dispatch(clearCurrentProject());

      // Загружаем проект
      const result = await dispatch(fetchProjectById(Number(id)));

      // Если проект загружен успешно, загружаем владельца и команду
      if (fetchProjectById.fulfilled.match(result)) {
        const projectData = result.payload;

        // Загружаем владельца
        dispatch(fetchUserById(projectData.ownerId));

        // Загружаем участников команды
        projectData.teamMembers.forEach(memberId => {
          dispatch(fetchUserById(memberId));
        });
      }
    };

    loadProject();
  }, [id, dispatch]);

  const loading = projectsLoading || usersLoading;

  if (loading && !project) {
    return (
      <div className="container" style={{ padding: '2rem 0', textAlign: 'center' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (projectsError || (!project && !loading)) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <h1>Project Not Found</h1>
        <p>{projectsError || 'The requested project could not be found.'}</p>
        <Link to="/projects">← Back to Projects</Link>
      </div>
    );
  }

  if (!project) return null;

  // Получаем участников команды из кеша
  const teamMembersArray = project.teamMembers
    .map(memberId => teamMembers[memberId])
    .filter(Boolean);

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div className="card">
        <div className="card__header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <span
                className="card__status"
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: '#e3f2fd',
                  color: '#1565c0',
                  fontSize: '0.875rem',
                }}
              >
                {project.status}
              </span>
              <span
                style={{
                  marginLeft: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: '#f3e5f5',
                  color: '#7b1fa2',
                  fontSize: '0.875rem',
                }}
              >
                {project.lookingFor}
              </span>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#666' }}>
              <div>
                Команда: {project.currentTeam}/{project.teamSize}
              </div>
              <div>Бюджет: {project.budget}₽</div>
              <div>Срок: {project.timeline}</div>
            </div>
          </div>
        </div>

        <div className="card__body">
          <h1 style={{ marginBottom: '1rem' }}>{project.name}</h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            {project.description}
          </p>

          <div style={{ display: 'grid', gap: '2rem' }}>
            <div>
              <h3>Technologies Used</h3>
              <div
                style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}
              >
                {project.tech.map((tech, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '1rem',
                      fontSize: '0.875rem',
                      border: '1px solid #e0e0e0',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3>Key Features</h3>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                {project.features.map((feature, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Requirements</h3>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                {project.requirements.map((requirement, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Project Owner</h3>
              {owner ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginTop: '0.5rem',
                    padding: '1rem',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '0.5rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600' }}>{owner.name}</div>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>
                      {owner.role} • {owner.location}
                    </div>
                    <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{owner.bio}</div>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#666', fontStyle: 'italic' }}>Loading owner...</div>
              )}
            </div>

            {teamMembersArray.length > 0 && (
              <div>
                <h3>Team Members</h3>
                <div
                  style={{
                    marginTop: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  {teamMembersArray.map(member => (
                    <div
                      key={member.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.75rem',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '0.5rem',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '500' }}>{member.name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#666' }}>
                          {member.role} • {member.skills.slice(0, 3).join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="card__footer"
          style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}
        >
          <Link to="/projects" style={{ marginRight: '1rem' }}>
            ← Back to Projects
          </Link>
          <Link to="/">Home</Link>
        </div>
      </div>
    </div>
  );
}
