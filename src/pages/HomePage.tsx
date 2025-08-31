import { ProjectCard } from '../components/ProjectCard';
import { RoleButtonsList } from '../components/RolesButtonsList';

export const HomePage = () => {
  return (
    <div className="homepage">
      <section className="homepage__features">
        <div className="container homepage__features-container">
          <h2 className="text-center">вступай в проекты</h2>
          <div className="homepage__features-grid">
            {/* Карточки проектов */}
            <ProjectCard />
            <div className="card">
              <div className="card__body">
                <h3 className="card__title">Mobile-First</h3>
                <p>Responsive design starting from mobile devices</p>
              </div>
            </div>
            <div className="card">
              <div className="card__body">
                <h3 className="card__title">SCSS Architecture</h3>
                <p>Organized and scalable CSS with Sass</p>
              </div>
            </div>
            <div className="card">
              <div className="card__body">
                <h3 className="card__title">Modern Stack</h3>
                <p>React, TypeScript, Redux Toolkit, Vite</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="homepage__hero">
        <div className="container">
          <h1 className="homepage__title">выбери свою роль</h1>
          <RoleButtonsList />
        </div>
      </section>
    </div>
  );
};
