import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api';
import toast from 'react-hot-toast';
import {
  ClientResponse,
  ClientProfileUpdateRequest,
  ClientListResponse,
  ClientFilter,
  ClientQuery
} from '../types/client.types';

interface ClientState {
  clients: ClientResponse[];
  selectedClient: ClientResponse | null;
  loading: boolean;
  error: string | null;
  meta?: any;
}

const initialState: ClientState = {
  clients: [],
  selectedClient: null,
  loading: false,
  error: null,
  meta: undefined,
};

export const getClientMe = createAsyncThunk<ClientResponse, void>('client/getClientMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.getClientMe();
    return data;
  } catch (err: any) {
    toast.error(err.message || 'Failed to fetch client profile');
    return rejectWithValue(err.message);
  }
});

export const updateClientProfile = createAsyncThunk<ClientResponse, ClientProfileUpdateRequest>('client/updateClientProfile', async (update, { rejectWithValue }) => {
  try {
    const { data } = await api.updateClientProfile(update);
    toast.success('Client profile updated');
    return data;
  } catch (err: any) {
    toast.error(err.message || 'Failed to update client profile');
    return rejectWithValue(err.message);
  }
});

export const deleteClientAccount = createAsyncThunk<{ message: string }, void>('client/deleteClientAccount', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.deleteClientAccount();
    toast.success('Client account deleted');
    return data;
  } catch (err: any) {
    toast.error(err.message || 'Failed to delete client account');
    return rejectWithValue(err.message);
  }
});

// Admin endpoints
export const getClients = createAsyncThunk<ClientListResponse, ClientFilter & ClientQuery | undefined>('client/getClients', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.getClients(params);
    return data;
  } catch (err: any) {
    toast.error(err.message || 'Failed to fetch clients');
    return rejectWithValue(err.message);
  }
});

export const getClientById = createAsyncThunk<ClientResponse, string>('client/getClientById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.getClientById(id);
    return data;
  } catch (err: any) {
    toast.error(err.message || 'Failed to fetch client');
    return rejectWithValue(err.message);
  }
});

export const updateClient = createAsyncThunk<ClientResponse, { id: string; update: ClientProfileUpdateRequest }>('client/updateClient', async ({ id, update }, { rejectWithValue }) => {
  try {
    const { data } = await api.updateClient(id, update);
    toast.success('Client updated');
    return data;
  } catch (err: any) {
    toast.error(err.message || 'Failed to update client');
    return rejectWithValue(err.message);
  }
});

export const deleteClient = createAsyncThunk<{ message: string }, string>('client/deleteClient', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.deleteClient(id);
    toast.success('Client deleted');
    return data;
  } catch (err: any) {
    toast.error(err.message || 'Failed to delete client');
    return rejectWithValue(err.message);
  }
});

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    setSelectedClient(state, action) {
      state.selectedClient = action.payload;
    },
    clearSelectedClient(state) {
      state.selectedClient = null;
    },
    resetClientState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClientMe.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getClientMe.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClient = action.payload.data.client;
      })
      .addCase(getClientMe.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(updateClientProfile.fulfilled, (state, action) => {
        if (action.payload && action.payload.data && action.payload.data.client) {
          state.selectedClient = action.payload.data.client;
        }
      })
      .addCase(deleteClientAccount.fulfilled, (state) => {
        state.selectedClient = null;
      })
      .addCase(getClients.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload.clients;
        state.meta = action.payload;
      })
      .addCase(getClients.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(getClientById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getClientById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClient = action.payload.data.client;
      })
      .addCase(getClientById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(updateClient.fulfilled, (state, action) => {
        if (action.payload && action.payload.data && action.payload.data.client) {
          state.selectedClient = action.payload.data.client;
          state.clients = state.clients.map(c => c._id === action.payload.data.client._id ? action.payload.data.client : c).filter(Boolean) as ClientResponse[];
        }
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.clients = state.clients.filter(c => c._id !== action.meta.arg);
        if (state.selectedClient && state.selectedClient._id === action.meta.arg) {
          state.selectedClient = null;
        }
      });
  },
});

export const { setSelectedClient, clearSelectedClient, resetClientState } = clientSlice.actions;
export default clientSlice.reducer; 