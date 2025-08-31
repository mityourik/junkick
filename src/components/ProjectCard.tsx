import { useState } from 'react';
import { Link } from 'react-router-dom';

export const ProjectCard = () => {
  const [projectStatus, _setProjectStatus] = useState('В разработке');
  const [projectName, _setProjectName] = useState('Сайт доставки Bronfood');
  const statusLookingFor = 'Набираем команду';

  return (
    <Link to={`/projects/${projectName}`} className="card card--link">
      <div className="card__header">
        <p className="card__status">{projectStatus}</p>
        <p className="card__status-looking-for">{statusLookingFor}</p>
      </div>
      <div className="card__body">
        <h3 className="card__title">{projectName}</h3>
      </div>
    </Link>
  );
};
