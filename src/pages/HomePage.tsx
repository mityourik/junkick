export default function HomePage() {
  return (
    <div className="homepage">
      <section className="homepage__hero">
        <div className="container">
          <h1 className="homepage__title">Welcome to Junkick</h1>
          <p className="homepage__subtitle">Modern mobile-first приложение с SCSS архитектурой</p>
          <div className="homepage__cta">
            <button className="btn btn--primary btn--lg">Get Started</button>
            <button className="btn btn--outline btn--lg">Learn More</button>
          </div>
        </div>
      </section>

      <section className="homepage__features">
        <div className="container">
          <h2 className="text-center">Features</h2>
          <div className="homepage__features-grid">
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
    </div>
  );
}
