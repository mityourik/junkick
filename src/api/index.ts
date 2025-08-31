// API базовая настройка
const API_BASE_URL = 'http://localhost:3001';

// Универсальная функция для HTTP запросов
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

// Типы данных
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
  id: number;
  name: string;
  description: string;
  status: string;
  lookingFor: string;
  category: string;
  tech: string[];
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

// API функции для пользователей
export const usersApi = {
  getAll: () => apiRequest<User[]>('/users'),
  getById: (id: number) => apiRequest<User>(`/users/${id}`),
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

// API функции для проектов
export const projectsApi = {
  getAll: () => apiRequest<Project[]>('/projects'),
  getById: (id: number) => apiRequest<Project>(`/projects/${id}`),
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
  // Поиск проектов
  search: (query: string) => apiRequest<Project[]>(`/projects?q=${encodeURIComponent(query)}`),
};

// API функции для ролей
export const rolesApi = {
  getAll: () => apiRequest<Role[]>('/roles'),
  getById: (id: string) => apiRequest<Role>(`/roles/${id}`),
};

// API функции для технологий
export const technologiesApi = {
  getAll: () => apiRequest<Technology[]>('/technologies'),
  getByCategory: (category: string) =>
    apiRequest<Technology[]>(`/technologies?category=${category}`),
};

// API функции для категорий
export const categoriesApi = {
  getAll: () => apiRequest<Category[]>('/categories'),
  getById: (id: string) => apiRequest<Category>(`/categories/${id}`),
};

// Экспорт всех API
export const api = {
  users: usersApi,
  projects: projectsApi,
  roles: rolesApi,
  technologies: technologiesApi,
  categories: categoriesApi,
};

export default api;
