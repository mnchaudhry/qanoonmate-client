import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../api';
import toast from 'react-hot-toast';
import { User, GetUsersRequest, GetUsersResponse, SearchUsersRequest, SearchUsersResponse, CheckUsernameResponse, CheckEmailResponse, BlockUserResponse, UpdateAvatarResponse, UpdateUsernameResponse, GetUserRoleResponse, GetUserByUsernameOrIdResponse, GetUserByIdResponse, UpdateUserRequest, UpdateUserResponse, DeleteUserResponse, BlockUserRequest, AddUserResponse, AddUserRequest } from '../types/user.types';
import { PaginationMeta } from '../types/api';

interface UserState {
    users: User[];
    currentUser: User | null;
    loading: boolean;
    error: string | null;
    searchResults: User[];
    meta: PaginationMeta;
}

const initialState: UserState = {
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    searchResults: [],
    meta: { currentPage: 1, limit: 10, totalCount: 0, totalPages: 1 },
};

export const getUsers = createAsyncThunk<GetUsersResponse, GetUsersRequest | undefined>('user/getUsers', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.getUsers(params);
        return data;
    } catch (err: any) {
        toast.error(err.message || 'Failed to fetch users');
        return rejectWithValue(err.message);
    }
});

export const searchUsers = createAsyncThunk<SearchUsersResponse, SearchUsersRequest>('user/searchUsers', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.searchUsers(params);
        return data;
    } catch (err: any) {
        toast.error(err.message || 'Failed to search users');
        return rejectWithValue(err.message);
    }
});

export const checkUsername = createAsyncThunk<CheckUsernameResponse, string>('user/checkUsername', async (username, { rejectWithValue }) => {
    try {
        const { data } = await api.checkUsername(username);
        return data;
    } catch (err: any) {
        toast.error(err.message || 'Failed to check username');
        return rejectWithValue(err.message);
    }
});

export const checkEmail = createAsyncThunk<CheckEmailResponse, string>('user/checkEmail', async (email, { rejectWithValue }) => {
    try {
        const { data } = await api.checkEmail(email);
        return data;
    } catch (err: any) {
        toast.error(err.message || 'Failed to check email');
        return rejectWithValue(err.message);
    }
});

export const addUser = createAsyncThunk<AddUserResponse, AddUserRequest>('user/addUser', async (input, { rejectWithValue }) => {
    try {
        const { data } = await api.addUser(input);
        return data;
    } catch (err: any) {
        toast.error(err.message || 'Failed to add user');
        return rejectWithValue(err.message);
    }
});

export const exportUsersCsv = createAsyncThunk<Blob, GetUsersRequest | undefined>('user/exportUsersCsv', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.exportUsersCsv(params);
        return data as unknown as Blob;
    } catch (err: any) {
        toast.error(err.message || 'Failed to export users');
        return rejectWithValue(err.message);
    }
});

export const bulkUploadUsers = createAsyncThunk<any, File>('user/bulkUploadUsers', async (file, { rejectWithValue }) => {
    try {
        const { data } = await api.bulkUploadUsers(file);
        toast.success('Bulk upload processed');
        return data;
    } catch (err: any) {
        toast.error(err.message || 'Failed to upload CSV');
        return rejectWithValue(err.message);
    }
});

export const blockUser = createAsyncThunk<BlockUserResponse, BlockUserRequest>('user/blockUser', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.blockUser(params);
        return data;
    } catch (err: any) {
        toast.error(err.message || 'Failed to block user');
        return rejectWithValue(err.message);
    }
});

export const updateAvatar = createAsyncThunk<UpdateAvatarResponse, File>('user/updateAvatar', async (file, { rejectWithValue }) => {
    try {
        const { data } = await api.updateAvatar(file);
        toast.success('Avatar updated');
        return data;
    } catch (err: any) {
        toast.error(err.message || 'Failed to update avatar');
        return rejectWithValue(err.message);
    }
});

export const updateUsername = createAsyncThunk<UpdateUsernameResponse, string>('user/updateUsername', async (username, { rejectWithValue }) => {
    try {
        const { data } = await api.updateUsername(username);
        toast.success('Username updated');
        return data;
    } catch (err: any) {
        toast.error(err.message || 'Failed to update username');
        return rejectWithValue(err.message);
    }
});

export const getUserRole = createAsyncThunk<GetUserRoleResponse, string>('user/getUserRole', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.getUserRole(id);
        return data;
    } catch (err: any) {
        toast.error(err.message || 'Failed to fetch user role');
        return rejectWithValue(err.message);
    }
});

export const getUserByUsernameOrId = createAsyncThunk<GetUserByUsernameOrIdResponse, string>('user/getUserByUsernameOrId', async (usernameOrId, { rejectWithValue }) => {
    try {
        const { data } = await api.getUserByUsernameOrId(usernameOrId);
        return data;
    } catch (err: any) {
        toast.error(err.message || 'Failed to fetch user');
        return rejectWithValue(err.message);
    }
});

export const getUserById = createAsyncThunk<GetUserByIdResponse, string>('user/getUserById', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.getUserById(id);
        return data;
    } catch (err: any) {
        toast.error(err.message || 'Failed to fetch user');
        return rejectWithValue(err.message);
    }
});

export const updateUser = createAsyncThunk<UpdateUserResponse, UpdateUserRequest>('user/updateUser', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.updateUser(params);
        toast.success('User updated');
        return data;
    } catch (err: any) {
        toast.error(err.message || 'Failed to update user');
        return rejectWithValue(err.message);
    }
});

export const deleteUser = createAsyncThunk<DeleteUserResponse, string>('user/deleteUser', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.deleteUser(id);
        toast.success('User deleted');
        return data;
    } catch (err: any) {
        toast.error(err.message || 'Failed to delete user');
        return rejectWithValue(err.message);
    }
}
);

export const resetUserPassword = createAsyncThunk<any, { id: string; password?: string }>('user/resetUserPassword', async ({ id, password }, { rejectWithValue }) => {
    try {
        const { data } = await api.resetUserPassword(id, password);
        toast.success('Password reset');
        return data;
    } catch (err: any) {
        toast.error(err.message || 'Failed to reset password');
        return rejectWithValue(err.message);
    }
});

export const getUserLogs = createAsyncThunk<any, string>('user/getUserLogs', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.getUserLogs(id);
        return data;
    } catch (err: any) {
        toast.error(err.message || 'Failed to fetch logs');
        return rejectWithValue(err.message);
    }
});


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser(state, action) {
            state.currentUser = action.payload;
        },
        clearSearchResults(state) {
            state.searchResults = [];
        },
        resetUserState: () => initialState,
        setCurrentPage(state, action: PayloadAction<number>) {
            state.meta.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.data?.users || [];
                state.meta = action.payload.meta || { currentPage: 1, limit: 10, totalCount: 0, totalPages: 1 };
            })
            .addCase(getUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            .addCase(searchUsers.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(searchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload.data?.users || [];
                state.meta = action.payload.meta || { currentPage: 1, limit: 10, totalCount: 0, totalPages: 1 };
            })
            .addCase(searchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            .addCase(getUserById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload?.data?.user || null;
            })
            .addCase(getUserById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(addUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.data && action.payload.data.user) {
                    state.users.unshift(action.payload.data.user);
                }
            })
            .addCase(addUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(bulkUploadUsers.fulfilled, (state, action) => {
                if (action.payload && action.payload.data && action.payload.data.users) {
                    const created = action.payload.data.users as User[]
                    // Prepend created users
                    state.users = [...created, ...state.users]
                }
            })

            .addCase(updateUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.data && action.payload.data.user) {
                    state.currentUser = action.payload.data.user;
                    state.users = state.users.map(u => u._id === action.payload.data?.user?._id ? action.payload.data?.user : u).filter(Boolean) as User[];
                }
            })
            .addCase(updateUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            .addCase(deleteUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.data && action.payload.data.user) {
                    state.users = state.users.filter(u => u._id !== action.payload.data?.user?._id);
                    if (state.currentUser && state.currentUser._id === action.payload.data.user._id) {
                        state.currentUser = null;
                    }
                }
            })
            .addCase(deleteUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            .addCase(blockUser.pending, (state) => { state.error = null; })
            .addCase(blockUser.fulfilled, (state, action) => {
                if (action.payload && action.payload.data && action.payload.data.user) {
                    const updated = action.payload.data.user;
                    state.users = state.users.map(u => u._id === updated._id ? updated : u);
                    if (state.currentUser && state.currentUser._id === updated._id) {
                        state.currentUser = updated;
                    }
                }
            })
            .addCase(blockUser.rejected, (state, action) => { state.error = action.payload as string; })
            .addCase(updateAvatar.fulfilled, (state, action) => {
                if (action.payload && action.payload.data && action.payload.data.user) {
                    state.currentUser = action.payload.data.user;
                }
            })
            .addCase(updateUsername.fulfilled, (state, action) => {
                if (action.payload && action.payload.data && action.payload.data.user) {
                    state.currentUser = action.payload.data.user;
                }
            })
            .addCase(getUserRole.fulfilled, () => {
                // Optionally store user role in state
            })
            .addCase(getUserByUsernameOrId.fulfilled, (state, action) => {
                if (action.payload && action.payload.data && action.payload.data.user) {
                    state.currentUser = action.payload.data.user;
                }
            })
    },
});

export const { setCurrentUser, clearSearchResults, resetUserState, setCurrentPage } = userSlice.actions;
export default userSlice.reducer; 