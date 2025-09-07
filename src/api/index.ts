const API_BASE_URL = 'http://localhost:3001';

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  skills: string[];
  bio: string;
  experience: number;
  location: string;
  portfolio: string;
  createdAt: string;
}

export interface Project {
  id: number | string;
  name: string;
  description: string;
  status: string;
  lookingFor: string;
  category: string;
  tech: string[];
  neededRoles: string[];
  teamSize: number;
  currentTeam: number;
  budget: string;
  timeline: string;
  complexity: string;
  image: string;
  features: string[];
  requirements: string[];
  ownerId: number;
  teamMembers: number[];
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: number;
  projectId: number | string;
  name: string;
  role: string;
  message: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  variant: string;
  color: string;
}

export interface Technology {
  id: number;
  name: string;
  category: string;
  icon: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

export const usersApi = {
  getAll: () => apiRequest<User[]>('/users'),
  getById: async (id: number) => {
    const list = await apiRequest<User[]>(`/users?id=${id}`);
    if (!Array.isArray(list) || list.length === 0) {
      throw new Error('User not found');
    }
    return list[0];
  },
  create: (user: Omit<User, 'id'>) =>
    apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    }),
  update: (id: number, user: Partial<User>) =>
    apiRequest<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(user),
    }),
  delete: (id: number) =>
    apiRequest<void>(`/users/${id}`, {
      method: 'DELETE',
    }),
};

export const projectsApi = {
  getAll: () => apiRequest<Project[]>('/projects'),
  getById: async (id: number | string) => {
    const list = await apiRequest<Project[]>(`/projects?id=${encodeURIComponent(String(id))}`);
    if (!Array.isArray(list) || list.length === 0) {
      throw new Error('Project not found');
    }
    return list[0];
  },
  getByCategory: (category: string) => apiRequest<Project[]>(`/projects?category=${category}`),
  getByStatus: (status: string) => apiRequest<Project[]>(`/projects?status=${status}`),
  create: (project: Omit<Project, 'id'>) =>
    apiRequest<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    }),
  update: (id: number, project: Partial<Project>) =>
    apiRequest<Project>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(project),
    }),
  delete: (id: number) =>
    apiRequest<void>(`/projects/${id}`, {
      method: 'DELETE',
    }),
  search: (query: string) => apiRequest<Project[]>(`/projects?q=${encodeURIComponent(query)}`),
};

export const rolesApi = {
  getAll: () => apiRequest<Role[]>('/roles'),
  getById: (id: string) => apiRequest<Role>(`/roles/${id}`),
};

export const technologiesApi = {
  getAll: () => apiRequest<Technology[]>('/technologies'),
  getByCategory: (category: string) =>
    apiRequest<Technology[]>(`/technologies?category=${category}`),
};

export const categoriesApi = {
  getAll: () => apiRequest<Category[]>('/categories'),
  getById: (id: string) => apiRequest<Category>(`/categories/${id}`),
};

export const applicationsApi = {
  create: (app: Omit<Application, 'id'>) =>
    apiRequest<Application>('/applications', {
      method: 'POST',
      body: JSON.stringify(app),
    }),
  getByProject: (projectId: number) =>
    apiRequest<Application[]>(`/applications?projectId=${projectId}`),
};

export const api = {
  users: usersApi,
  projects: projectsApi,
  roles: rolesApi,
  technologies: technologiesApi,
  categories: categoriesApi,
  applications: applicationsApi,
};

export default api;
