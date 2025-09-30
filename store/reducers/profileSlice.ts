import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LawyerProfile, ProfileCompletionData } from '@/lib/types/profile.types';

interface ProfileState {
  profile: LawyerProfile | null;
  completion: ProfileCompletionData | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
}

const initialState: ProfileState = {
  profile: null,
  completion: null,
  loading: false,
  error: null,
  updating: false,
};

// Async thunks
export const fetchProfileCompletion = createAsyncThunk(
  'profile/fetchCompletion',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/lawyer/profile/completion', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile completion');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateProfileSection = createAsyncThunk(
  'profile/updateSection',
  async ({ section, data }: { section: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/lawyer/profile/section/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ section, data }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile section');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchPublicProfile = createAsyncThunk(
  'profile/fetchPublic',
  async (lawyerId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/lawyer/profile/public/${lawyerId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch public profile');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateProfileVisibility = createAsyncThunk(
  'profile/updateVisibility',
  async (visibility: string, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/lawyer/profile/visibility', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ visibility }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile visibility');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setProfile: (state, action: PayloadAction<LawyerProfile>) => {
      state.profile = action.payload;
    },
    setCompletion: (state, action: PayloadAction<ProfileCompletionData>) => {
      state.completion = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch profile completion
    builder
      .addCase(fetchProfileCompletion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileCompletion.fulfilled, (state, action) => {
        state.loading = false;
        state.completion = action.payload;
      })
      .addCase(fetchProfileCompletion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update profile section
    builder
      .addCase(updateProfileSection.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateProfileSection.fulfilled, (state, action) => {
        state.updating = false;
        state.completion = action.payload.completion;
      })
      .addCase(updateProfileSection.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      });

    // Fetch public profile
    builder
      .addCase(fetchPublicProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicProfile.fulfilled, (state, action) => {
        state.loading = false;
        // Convert public profile to full profile structure
        state.profile = action.payload as LawyerProfile;
      })
      .addCase(fetchPublicProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update profile visibility
    builder
      .addCase(updateProfileVisibility.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateProfileVisibility.fulfilled, (state, action) => {
        state.updating = false;
        if (state.profile) {
          state.profile.professionalOverview.profileVisibility = action.payload.visibility;
        }
      })
      .addCase(updateProfileVisibility.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setProfile, setCompletion } = profileSlice.actions;
export default profileSlice.reducer;
