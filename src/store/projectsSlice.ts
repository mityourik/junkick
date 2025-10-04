import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api, type Project } from '../api';

export const fetchProjects = createAsyncThunk('projects/fetchAll', async () => {
  const response = await api.projects.getAll();
  // API возвращает объект с полем projects, извлекаем массив
  return Array.isArray(response) ? response : response.projects || [];
});

export const fetchProjectById = createAsyncThunk('projects/fetchById', async (id: number) => {
  return await api.projects.getById(id);
});

export const searchProjects = createAsyncThunk('projects/search', async (query: string) => {
  const response = await api.projects.search(query);
  // API возвращает объект с полем projects, извлекаем массив
  return Array.isArray(response) ? response : response.projects || [];
});

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  searchResults: Project[];
  loading: boolean;
  error: string | null;
  filters: {
    category?: string;
    status?: string;
  };
}

const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  searchResults: [],
  loading: false,
  error: null,
  filters: {},
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProjectsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentProject: state => {
      state.currentProject = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProjects.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })

      .addCase(fetchProjectById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch project';
      })

      .addCase(searchProjects.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search projects';
      });
  },
});

export const { setFilters, clearCurrentProject, clearError } = projectsSlice.actions;

export const selectProjects = (state: { projects: ProjectsState }) => state.projects.projects;
export const selectCurrentProject = (state: { projects: ProjectsState }) =>
  state.projects.currentProject;
export const selectProjectsLoading = (state: { projects: ProjectsState }) => state.projects.loading;
export const selectProjectsError = (state: { projects: ProjectsState }) => state.projects.error;
export const selectSearchResults = (state: { projects: ProjectsState }) =>
  state.projects.searchResults;
export const selectFilters = (state: { projects: ProjectsState }) => state.projects.filters;

export default projectsSlice.reducer;
