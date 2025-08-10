import { useState } from 'react';

export const ProjectCard = () => {
  const [projectStatus, _setProjectStatus] = useState('В разработке');
  const [projectName, _setProjectName] = useState('Сайт доставки Bronfood');
  return (
    <div className="card">
      <div className="card__header">
        <p className="card__status">{projectStatus}</p>
      </div>
      <h3 className="card__title">{projectName}</h3>
      <p className="card__subtitle">Фронтенд на React TS, Redux Toolkit и Vite, бэк на Go</p>
      {/* <div className="card__footer">
        <button className="btn btn--primary">Подробнее</button>
        <button className="btn btn--secondary">Участвовать</button>
      </div> */}
    </div>
  );
};
