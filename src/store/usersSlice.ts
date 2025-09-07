import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api, type User } from '../api';

export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  return await api.users.getAll();
});

export const fetchUserById = createAsyncThunk('users/fetchById', async (id: number) => {
  return await api.users.getById(id);
});

interface UsersState {
  users: User[];
  currentUser: User | null;
  teamMembers: Record<number, User>;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  teamMembers: {},
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: state => {
      state.currentUser = null;
    },
    addTeamMember: (state, action: PayloadAction<User>) => {
      state.teamMembers[action.payload.id] = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })

      .addCase(fetchUserById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.teamMembers[action.payload.id] = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
      });
  },
});

export const { setCurrentUser, clearCurrentUser, addTeamMember, clearError } = usersSlice.actions;

export const selectUsers = (state: { users: UsersState }) => state.users.users;
export const selectCurrentUser = (state: { users: UsersState }) => state.users.currentUser;
export const selectTeamMembers = (state: { users: UsersState }) => state.users.teamMembers;
export const selectUsersLoading = (state: { users: UsersState }) => state.users.loading;
export const selectUsersError = (state: { users: UsersState }) => state.users.error;
export const selectUserById = (id: number) => (state: { users: UsersState }) =>
  state.users.teamMembers[id];

export default usersSlice.reducer;
