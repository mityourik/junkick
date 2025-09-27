import { Link } from 'react-router-dom';
import type { Project } from '../api';

interface ProjectCardProps {
  project: Project;
  showTech?: boolean;
  showTeam?: boolean;
}

export const ProjectCard = ({ project, showTech = true, showTeam = true }: ProjectCardProps) => {
  const projectId = project.customId || project.id;
  return (
    <Link to={`/projects/${projectId}`} className="card card--link card--project">
      <div className="card__header">
        <span className="card__status">{project.status}</span>
        <span className="card__status-looking-for">{project.lookingFor}</span>
      </div>
      <div className="card__body">
        <h3 className="card__title">{project.name}</h3>
        {showTech && (
          <div className="card__meta">Технологии: {project.tech.slice(0, 4).join(', ')}</div>
        )}
        {showTeam && (
          <div className="card__meta">
            Команда: {project.currentTeam}/{project.teamSize}
          </div>
        )}
      </div>
    </Link>
  );
};
