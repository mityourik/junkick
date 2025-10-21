const API_BASE_URL = '/api';

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Получаем токен из localStorage
  const token = localStorage.getItem('accessToken');

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
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
  id?: number | string;
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  avatar?: string;
  skills: string;
  bio: string;
  experience: number;
  location: string;
  github_link: string;
  createdAt?: string;
}

export interface Project {
  id?: number | string;
  _id?: string;
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
  ownerId: number | { _id: string; name: string; email: string; avatar: string };
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
  getById: (id: number | string) => apiRequest<User>(`/users/${encodeURIComponent(String(id))}`),
  create: (user: Omit<User, 'id'>) =>
    apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    }),
  update: (id: number | string, user: Partial<User>) =>
    apiRequest<User>(`/users/${encodeURIComponent(String(id))}`, {
      method: 'PATCH',
      body: JSON.stringify(user),
    }),
  delete: (id: number | string) =>
    apiRequest<void>(`/users/${encodeURIComponent(String(id))}`, {
      method: 'DELETE',
    }),
};

export const projectsApi = {
  getAll: () => apiRequest<Project[]>('/projects'),
  getByOwner: (ownerId: number | string) =>
    apiRequest<Project[]>(`/projects/owner/${encodeURIComponent(String(ownerId))}`),
  getById: (id: number | string) =>
    apiRequest<Project>(`/projects/${encodeURIComponent(String(id))}`),
  getByCategory: (category: string) =>
    apiRequest<Project[]>(`/projects/category/${encodeURIComponent(category)}`),
  getByStatus: (status: string) =>
    apiRequest<Project[]>(`/projects/status/${encodeURIComponent(status)}`),
  create: (project: Omit<Project, 'id'>) =>
    apiRequest<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    }),
  update: (id: number | string, project: Partial<Project>) =>
    apiRequest<Project>(`/projects/${encodeURIComponent(String(id))}`, {
      method: 'PATCH',
      body: JSON.stringify(project),
    }),
  delete: (id: number | string) =>
    apiRequest<void>(`/projects/${encodeURIComponent(String(id))}`, {
      method: 'DELETE',
    }),
  search: (query: string) =>
    apiRequest<Project[]>(`/projects/search?q=${encodeURIComponent(query)}`),
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
  getByProject: (projectId: number | string) =>
    apiRequest<Application[]>(`/applications/project/${encodeURIComponent(String(projectId))}`),
};

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ user: User; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    avatar?: string;
    skills?: string[];
    bio?: string;
    experience?: number;
    location?: string;
    portfolio?: string;
  }) =>
    apiRequest<{ user: User; accessToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  logout: (userId: number | string) =>
    apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ userId, type: 'logout', createdAt: new Date().toISOString() }),
    }),
  validateUser: async (_userId: number | string) => {
    try {
      const user = await apiRequest<User>(`/auth/me`);
      return user;
    } catch {
      return null;
    }
  },
};

export const api = {
  users: usersApi,
  projects: projectsApi,
  roles: rolesApi,
  technologies: technologiesApi,
  categories: categoriesApi,
  applications: applicationsApi,
  auth: authApi,
};

export default api;
