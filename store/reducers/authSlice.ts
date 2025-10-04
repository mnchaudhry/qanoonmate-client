import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api';
import toast from 'react-hot-toast';
import { fetchAndSetCSRFToken } from '../api/axios';
import { UserRole } from '@/lib/enums';
import { ChangePasswordRequest, ForgetPasswordRequest, ForgetPasswordUpdateRequest, LoginRequest, SignupRequest, ClientSignupRequest, LawyerSignupRequest, LawyerSignupStep1Request, LawyerSignupStep2Request, LawyerSignupStep3Request, LawyerSignupStep4Request, LawyerSignupStep5Request, UpdateProfileRequest, VerifyOtpRequest } from '../types/auth.types';
import { Client } from '../types/client.types';
import { Lawyer } from '../types/lawyer.types';
import { User } from '../types/user.types';
import localStorageManager from '@/utils/localStorage';
import { getErrorMessage } from '@/lib/utils';

interface AuthState {
  user: User | Client | Lawyer | null;
  token: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessions: any[];
}

const initialState: AuthState = {
  user: null,
  token: null,
  sessionId: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  sessions: [],
};

// --- Async Thunks ---
// Client signup
export const clientSignup = createAsyncThunk('auth/clientSignup', async (input: ClientSignupRequest, { rejectWithValue }) => {
  try {
    const { data } = await api.clientSignup(input);
    localStorageManager.setItem('OTP_EMAIL', JSON.stringify(input.email))
    if (data.success) {
      toast.success(data.message);
      return data.data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'Client signup failed');
    toast.error(message);
    return rejectWithValue(message);
  }
});

// Progressive Lawyer Signup Steps
export const lawyerSignupStep1 = createAsyncThunk('auth/lawyerSignupStep1', async (input: LawyerSignupStep1Request, { rejectWithValue }) => {
  try {
    const { data } = await api.lawyerSignupStep1(input);
    if (data.success) {
      toast.success(data.message);
      return data.data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'Step 1 failed');
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const lawyerSignupStep2 = createAsyncThunk('auth/lawyerSignupStep2', async (input: LawyerSignupStep2Request, { rejectWithValue }) => {
  try {
    const { data } = await api.lawyerSignupStep2(input);
    if (data.success) {
      toast.success(data.message);
      return data.data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'Step 2 failed');
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const lawyerSignupStep3 = createAsyncThunk('auth/lawyerSignupStep3', async (input: LawyerSignupStep3Request, { rejectWithValue }) => {
  try {
    const { data } = await api.lawyerSignupStep3(input);
    if (data.success) {
      toast.success(data.message);
      return data.data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'Step 3 failed');
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const lawyerSignupStep4 = createAsyncThunk('auth/lawyerSignupStep4', async (input: LawyerSignupStep4Request, { rejectWithValue }) => {
  try {
    const { data } = await api.lawyerSignupStep4(input);
    if (data.success) {
      toast.success(data.message);
      return data.data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'Step 4 failed');
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const lawyerSignupStep5 = createAsyncThunk('auth/lawyerSignupStep5', async (input: LawyerSignupStep5Request, { rejectWithValue }) => {
  try {
    const { data } = await api.lawyerSignupStep5(input);
    localStorageManager.setItem('OTP_EMAIL', JSON.stringify(input.email))
    if (data.success) {
      toast.success(data.message);
      return data.data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'Step 5 failed');
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const getLawyerSignupProgress = createAsyncThunk('auth/getLawyerSignupProgress', async (email: string, { rejectWithValue }) => {
  try {
    const { data } = await api.getLawyerSignupProgress(email);
    if (data.success) {
      return data.data;
    }
    else {
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'Failed to get signup progress');
    return rejectWithValue(message);
  }
});

// Legacy lawyer signup (for backward compatibility)
export const lawyerSignup = createAsyncThunk('auth/lawyerSignup', async (input: LawyerSignupRequest, { rejectWithValue }) => {
  try {
    const { data } = await api.lawyerSignup(input);
    localStorageManager.setItem('OTP_EMAIL', JSON.stringify(input.email))
    if (data.success) {
      toast.success(data.message);
      return data.data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'Lawyer signup failed');
    toast.error(message);
    return rejectWithValue(message);
  }
});

// Legacy signup (for backward compatibility)
export const signup = createAsyncThunk('auth/signup', async ({ role, data: input }: { role: UserRole, data: SignupRequest }, { rejectWithValue }) => {
  try {
    const { data } = await api.signup(role, input);
    localStorageManager.setItem('OTP_EMAIL', JSON.stringify(input.email))
    if (data.success) {
      toast.success(data.message);
      return data.data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'Signup failed');
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const login = createAsyncThunk('auth/login', async ({ role, data: input }: { role: UserRole, data: LoginRequest }, { rejectWithValue }) => {
  try {
    const { data } = await api.login(role, input);
    if (data.success) {
      toast.success(data.message);
      return data.data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'Login failed');
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const forgetPasswordRequest = createAsyncThunk('auth/forgetPasswordRequest', async ({ role, data: input }: { role: UserRole, data: ForgetPasswordRequest }, { rejectWithValue }) => {
  try {
    const { data } = await api.forgetPasswordRequest(role, input);
    if (data.success) {
      toast.success(data.message);
      localStorageManager.setItem('OTP_EMAIL', JSON.stringify(input.email))
      return data.data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'Forget password request failed');
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ role, data: input }: { role: UserRole, data: ForgetPasswordUpdateRequest }, { rejectWithValue }) => {
  try {
    const { data } = await api.resetPassword(role, input);
    if (data.success) {
      toast.success(data.message);
      return data.data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'Forget password update failed');
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async ({ role, data: input }: { role: UserRole, data: VerifyOtpRequest }, { rejectWithValue }) => {
  try {
    const { data } = await api.verifyOTP(role, input);
    if (data.success) {
      toast.success(data.message);
      return data.data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'OTP verification failed');
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const resendOTP = createAsyncThunk('auth/resendOTP', async ({ role, data: input }: { role: UserRole, data: VerifyOtpRequest }, { rejectWithValue }) => {
  try {
    const { data } = await api.resendOTP(role, input);
    if (data.success) {
      toast.success(data.message);
      return data.data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'Resend OTP failed');
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.logout();
    if (data.success) {
      localStorageManager.clear();
      return true;
    }
    else {
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'Logout failed');
    return rejectWithValue(message);
  }
});

export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.getProfile();
    if (data.success) {
      return data.data;
    }
    else {
      // toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'Get profile failed');
    return rejectWithValue(message);
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async ({ data, file }: { data: UpdateProfileRequest, file: File | null }, { rejectWithValue }) => {
  try {

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    if (file) formData.append('file', file);

    const { data: res } = await api.updateProfile(formData);
    if (res.success) {
      toast.success(res.message);
      return res.data;
    }
    else {
      toast.error(res.message);
      return rejectWithValue(res.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'Update profile failed');
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const changePassword = createAsyncThunk('auth/changePassword', async ({ oldPassword, newPassword }: ChangePasswordRequest, { rejectWithValue }) => {
  try {
    const { data } = await api.changePassword({ oldPassword, newPassword });
    if (data.success) {
      toast.success(data.message);
      return data.data;
    }
    else return null
  } catch (err: any) {
    const message = getErrorMessage(err, 'Change password failed');
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.refreshToken();
    if (data.success) {
      return data.data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'Refresh token failed');
    return rejectWithValue(message);
  }
});

export const listSessions = createAsyncThunk('auth/listSessions', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.listSessions();
    if (data.success) {
      return data.data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'List sessions failed');
    return rejectWithValue(message);
  }
});

export const revokeSession = createAsyncThunk('auth/revokeSession', async (sessionId: string, { rejectWithValue }) => {
  try {
    const { data } = await api.revokeSession(sessionId);
    if (data.success) {
      toast.success(data.message);
      return data.data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'Revoke session failed');
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const hydrateAuth = createAsyncThunk('auth/hydrateAuth', async (options: { silent?: boolean } = {}, { dispatch, rejectWithValue }) => {
  const { silent = false } = options;
  try {
    await fetchAndSetCSRFToken();
    const { payload, meta } = await dispatch(getProfile());
    console.log('payload', payload);
    if (meta.requestStatus === 'fulfilled') {
      return payload;
    } else {
      await dispatch(logout());
      if (!silent) {
        toast.error('Session invalid');
      }
      return rejectWithValue('');
    }
  } catch (err: any) {
    await dispatch(logout());
    if (!silent) toast.error('Hydration failed');
    const message = getErrorMessage(err, 'Hydration failed');
    return rejectWithValue('');
  }
});


export const deactivate = createAsyncThunk('auth/deactivate', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.deactivate();
    if (data.success) {
      toast.success(data.message);
      return data.data;
    }
    else {
      toast.error(data.message);
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    const message = getErrorMessage(err, 'Deactivate failed');
    toast.error(message);
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: () => initialState,
    setToken: (state, action) => { state.token = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      // Client Signup
      .addCase(clientSignup.pending, (state) => {
        state.error = null;
      })
      .addCase(clientSignup.fulfilled, (state, action) => {
        // Client signup success - user will be verified via OTP
      })
      .addCase(clientSignup.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Progressive Lawyer Signup Steps
      .addCase(lawyerSignupStep1.pending, (state) => {
        state.error = null;
      })
      .addCase(lawyerSignupStep1.fulfilled, (state, action) => {
        // Step 1 completed - lawyer created/updated
      })
      .addCase(lawyerSignupStep1.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(lawyerSignupStep2.pending, (state) => {
        state.error = null;
      })
      .addCase(lawyerSignupStep2.fulfilled, (state, action) => {
        // Step 2 completed
      })
      .addCase(lawyerSignupStep2.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(lawyerSignupStep3.pending, (state) => {
        state.error = null;
      })
      .addCase(lawyerSignupStep3.fulfilled, (state, action) => {
        // Step 3 completed
      })
      .addCase(lawyerSignupStep3.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(lawyerSignupStep4.pending, (state) => {
        state.error = null;
      })
      .addCase(lawyerSignupStep4.fulfilled, (state, action) => {
        // Step 4 completed
      })
      .addCase(lawyerSignupStep4.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(lawyerSignupStep5.pending, (state) => {
        state.error = null;
      })
      .addCase(lawyerSignupStep5.fulfilled, (state, action) => {
        // Step 5 completed - OTP sent
      })
      .addCase(lawyerSignupStep5.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(getLawyerSignupProgress.pending, (state) => {
        state.error = null;
      })
      .addCase(getLawyerSignupProgress.fulfilled, (state, action) => {
        // Progress retrieved
      })
      .addCase(getLawyerSignupProgress.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Legacy Lawyer Signup
      .addCase(lawyerSignup.pending, (state) => {
        state.error = null;
      })
      .addCase(lawyerSignup.fulfilled, (state, action) => {
        // Lawyer signup success - user will be verified via OTP
      })
      .addCase(lawyerSignup.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Legacy Signup
      .addCase(signup.pending, (state) => {
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {

      })
      .addCase(signup.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {

        if (!action.payload) return;
        state.user = action.payload;
        // TODO: look into it
        //  state.token = action.payload?.token || null;
        // state.sessionId = action.payload?.sessionId || null;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.sessionId = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload?.data?.token || null;
        state.sessionId = action.payload?.data?.sessionId || null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // OTP
      .addCase(verifyOTP.pending, (state) => {
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.user = action.payload || null;
        state.isAuthenticated = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Resend OTP
      .addCase(resendOTP.pending, (state) => {
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {

      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Password Reset
      .addCase(forgetPasswordRequest.pending, (state) => {
        state.error = null;
      })
      .addCase(forgetPasswordRequest.fulfilled, (state) => {

      })
      .addCase(forgetPasswordRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {

      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // List Sessions
      .addCase(listSessions.pending, (state) => {
        state.error = null;
      })
      .addCase(listSessions.fulfilled, (state, action) => {
        state.sessions = action.payload?.data || [];
      })
      .addCase(listSessions.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Revoke Session
      .addCase(revokeSession.pending, (state) => {
        state.error = null;
      })
      .addCase(revokeSession.fulfilled, (state) => {

      })
      .addCase(revokeSession.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Hydrate Auth
      .addCase(hydrateAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.isLoading = false;
      })
      .addCase(hydrateAuth.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        state.sessionId = null;
        state.error = action.payload as string;
        state.isLoading = false;
      })

      // Deactivate
      .addCase(deactivate.pending, (state) => {
        state.error = null;
      })
      .addCase(deactivate.fulfilled, (state) => {

      })
      .addCase(deactivate.rejected, (state, action) => {
        state.error = action.payload as string;
      })
  },
});

export default authSlice.reducer;
export const { resetAuthState, setToken } = authSlice.actions;
