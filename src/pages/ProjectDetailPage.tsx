import { useParams, Link } from 'react-router-dom';

const projectDetails: Record<
  string,
  {
    name: string;
    description: string;
    tech: string;
    features: string[];
  }
> = {
  '1': {
    name: 'E-commerce App',
    description:
      'A full-stack e-commerce application with user authentication, product management, and payment integration.',
    tech: 'React, Node.js, MongoDB, Stripe',
    features: [
      'User Authentication',
      'Product Catalog',
      'Shopping Cart',
      'Payment Processing',
      'Admin Dashboard',
    ],
  },
  '2': {
    name: 'Task Manager',
    description:
      'A collaborative task management tool with real-time updates and team collaboration features.',
    tech: 'Vue.js, Express, PostgreSQL, Socket.io',
    features: [
      'Real-time Updates',
      'Team Collaboration',
      'Task Assignment',
      'Progress Tracking',
      'File Attachments',
    ],
  },
  '3': {
    name: 'Social Media Dashboard',
    description:
      'A comprehensive dashboard for managing multiple social media accounts and analytics.',
    tech: 'React, Redux, Firebase, Chart.js',
    features: [
      'Multi-platform Support',
      'Analytics Dashboard',
      'Content Scheduling',
      'Engagement Tracking',
      'Report Generation',
    ],
  },
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const project = id ? projectDetails[id] : null;

  if (!project) {
    return (
      <div>
        <h1>Project Not Found</h1>
        <Link to="/projects">← Back to Projects</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>{project.name}</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{project.description}</p>

      <h3>Technologies Used</h3>
      <p>{project.tech}</p>

      <h3>Key Features</h3>
      <ul>
        {project.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>

      <div style={{ marginTop: '2rem' }}>
        <Link to="/projects" style={{ marginRight: '1rem' }}>
          ← Back to Projects
        </Link>
        <Link to="/">Home</Link>
      </div>
    </div>
  );
}
