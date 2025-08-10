import { Link } from 'react-router-dom';

const projects = [
  { id: 1, name: 'E-commerce App', tech: 'React, Node.js, MongoDB' },
  { id: 2, name: 'Task Manager', tech: 'Vue.js, Express, PostgreSQL' },
  { id: 3, name: 'Social Media Dashboard', tech: 'React, Redux, Firebase' },
];

export default function ProjectsPage() {
  return (
    <div>
      <h1>My Projects</h1>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        {projects.map(project => (
          <div
            key={project.id}
            style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}
          >
            <h3>
              <Link
                to={`/projects/${project.id}`}
                style={{ textDecoration: 'none', color: '#646cff' }}
              >
                {project.name}
              </Link>
            </h3>
            <p>Technologies: {project.tech}</p>
          </div>
        ))}
      </div>
      <Link to="/" style={{ marginTop: '2rem', display: 'inline-block' }}>
        ← Back to Home
      </Link>
    </div>
  );
}
