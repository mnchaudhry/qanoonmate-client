import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  uploadSummaryDocument,
  createTextSummary,
  getUserSummaries,
  getSummaryStats,
  getSummaryByIdNew,
  updateSummaryDetails,
  retrySummary,
  exportSummary,
  deleteSummaryNew,
} from "../api";
import { Summary } from "@/store/types/api";

export interface SummaryStats {
  total: number;
  completed: number;
  processing: number;
  failed: number;
  avgCompressionRatio: number;
  totalOriginalLength: number;
  totalSummaryLength: number;
}

export interface SummaryProgress {
  stage: string;
  message: string;
  progress: number;
  summaryId?: string;
  metadata?: any;
}

export interface SummaryState {
  summaries: Summary[];
  currentSummary: Summary | null;
  stats: SummaryStats | null;
  loading: boolean;
  error: string | null;
  uploadProgress: number;
  processingSummaries: string[];
  progress: number;
  streamingSummary: string;
}

const initialState: SummaryState = {
  summaries: [],
  currentSummary: null,
  stats: null,
  loading: false,
  error: null,
  uploadProgress: 0,
  processingSummaries: [],
  progress: 0,
  streamingSummary: "",
};

// Async thunks
export const uploadDocument = createAsyncThunk(
  "summary/uploadDocument",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await uploadSummaryDocument(formData);
      console.log("uploadDocument", data);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload document"
      );
    }
  }
);

export const createSummary = createAsyncThunk(
  "summary/createSummary",
  async (formData: any, { rejectWithValue }) => {
    try {
      const { data } = await createTextSummary(formData);
      console.log("summary data", data);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create summary"
      );
    }
  }
);

export const fetchUserSummaries = createAsyncThunk(
  "summary/fetchUserSummaries",
  async (params: any, { rejectWithValue }) => {
    try {
      const { data } = await getUserSummaries(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch summaries"
      );
    }
  }
);

export const fetchSummaryStats = createAsyncThunk(
  "summary/fetchSummaryStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getSummaryStats();
      return data?.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch summary stats"
      );
    }
  }
);

export const fetchSummaryById = createAsyncThunk(
  "summary/fetchSummaryById",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await getSummaryByIdNew(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch summary"
      );
    }
  }
);

export const updateSummary = createAsyncThunk(
  "summary/updateSummary",
  async (
    {
      id,
      formData,
    }: {
      id: string;
      formData: { title?: string; metadata?: any; settings?: any };
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await updateSummaryDetails(id, formData);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update summary"
      );
    }
  }
);

export const retrySummaryProcessing = createAsyncThunk(
  "summary/retrySummary",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await retrySummary(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to retry summary"
      );
    }
  }
);

export const deleteSummary = createAsyncThunk(
  "summary/deleteSummary",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteSummaryNew(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete summary"
      );
    }
  }
);

export const exportSummaryData = createAsyncThunk(
  "summary/exportSummary",
  async (
    { id, format }: { id: string; format?: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await exportSummary(id, format);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to export summary"
      );
    }
  }
);

const summarySlice = createSlice({
  name: "summary",
  initialState,
  reducers: {
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    addProcessingSummary: (state, action: PayloadAction<string>) => {
      if (!state.processingSummaries.includes(action.payload)) {
        state.processingSummaries.push(action.payload);
      }
    },
    removeProcessingSummary: (state, action: PayloadAction<string>) => {
      state.processingSummaries = state.processingSummaries.filter(
        (id) => id !== action.payload
      );
    },
    updateSummaryProgress: (state, action: PayloadAction<SummaryProgress>) => {
      const { summaryId, progress } = action.payload;
      if (summaryId) {
        const summary = state.summaries.find((s) => s._id === summaryId);
        if (summary) {
          summary.status = progress >= 100 ? "completed" : "processing";
        }
      }
    },
    updateSummaryInRealTime: (state, action: PayloadAction<Summary>) => {
      console.log("updateSummaryInRealTime", action.payload);
      // Ensure summaries array exists
      if (!state.summaries) {
        state.summaries = [];
      }

      const index = state.summaries.findIndex(
        (s) => s._id === action.payload._id
      );
      if (index !== -1) {
        state.summaries[index] = action.payload;
      } else {
        state.summaries.unshift(action.payload);
      }

      if (state.currentSummary?._id === action.payload._id) {
        state.currentSummary = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentSummary: (state) => {
      state.currentSummary = null;
      state.progress = 0;
      state.streamingSummary = "";
    },
    // Socket event handlers
    handleSummaryProgress: (state, action: PayloadAction<SummaryProgress>) => {
      console.log("handleSummaryProgress", action.payload);
      const { summaryId, progress } = action.payload;
      if (summaryId) {
        // Ensure summaries array exists
        if (!state.summaries) {
          state.summaries = [];
        }

        const summary = state.summaries.find((s) => s._id === summaryId);
        if (summary) {
          summary.status = progress >= 100 ? "completed" : "processing";
        }
        if (state.currentSummary?._id === summaryId) {
          state.currentSummary.status =
            progress >= 100 ? "completed" : "processing";
        }
      }
      state.progress = progress;
    },
    handleSummaryStream: (
      state,
      action: PayloadAction<{ summaryId: string; content: string }>
    ) => {
      console.log("handleSummaryStream", action.payload.content);
      // if (
      //   state.currentSummary?._id === action.payload.summaryId
      // ) {
        console.log("handleSummaryStream", action.payload);
        state.streamingSummary = action.payload.content;
      // }
    },
    handleSummaryComplete: (
      state,
      action: PayloadAction<{ summary: Summary }>
    ) => {
      const { summary } = action.payload;
      // Ensure summaries array exists
      if (!state.summaries) {
        state.summaries = [];
      }

      const index = state.summaries.findIndex((s) => s._id === summary._id);
      if (index !== -1) {
        state.summaries[index] = summary;
      } else {
        state.summaries.unshift(summary);
      }

      if (state.currentSummary?._id === summary._id) {
        state.currentSummary = summary;
      }

      // Remove from processing list
      state.processingSummaries = state.processingSummaries.filter(
        (id) => id !== summary._id
      );
      state.progress = 100;
      state.streamingSummary = "";
    },
    handleSummaryError: (
      state,
      action: PayloadAction<{ summaryId: string; error: string }>
    ) => {
      const { summaryId, error } = action.payload;
      // Ensure summaries array exists
      if (!state.summaries) {
        state.summaries = [];
      }

      const summary = state.summaries.find((s) => s._id === summaryId);
      if (summary) {
        summary.status = "failed";
        summary.error = error;
      }

      if (state.currentSummary?._id === summaryId) {
        state.currentSummary.status = "failed";
        state.currentSummary.error = error;
      }

      // Remove from processing list
      state.processingSummaries = state.processingSummaries.filter(
        (id) => id !== summaryId
      );
    },
    handleSummaryAbort: (
      state,
      action: PayloadAction<{ summaryId: string }>
    ) => {
      const { summaryId } = action.payload;
      // Ensure summaries array exists
      if (!state.summaries) {
        state.summaries = [];
      }

      const summary = state.summaries.find((s) => s._id === summaryId);
      if (summary) {
        summary.status = "failed";
      }

      if (state.currentSummary?._id === summaryId) {
        state.currentSummary.status = "failed";
      }

      // Remove from processing list
      state.processingSummaries = state.processingSummaries.filter(
        (id) => id !== summaryId
      );
    },
    setCurrentSummary: (state, action: PayloadAction<Summary>) => {
      state.currentSummary = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Upload Document
    builder
      .addCase(uploadDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure summaries array exists
        if (!state.summaries) {
          state.summaries = [];
        }
        state.summaries.unshift(action.payload!);
        state.currentSummary = action.payload!;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Summary
    builder
      .addCase(createSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSummary.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure summaries array exists
        if (!state.summaries) {
          state.summaries = [];
        }
        // @ts-ignore
        state.summaries.unshift(action.payload!);
        // @ts-ignore
        state.currentSummary = action.payload!;
      })
      .addCase(createSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch User Summaries
    builder
      .addCase(fetchUserSummaries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSummaries.fulfilled, (state, action) => {
        state.loading = false;
        state.summaries = action.payload.data || [];
      })
      .addCase(fetchUserSummaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Summary Stats
    builder
      .addCase(fetchSummaryStats.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchSummaryStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchSummaryStats.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Fetch Summary by ID
    builder
      .addCase(fetchSummaryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSummaryById.fulfilled, (state, action) => {
        state.loading = false;
        // @ts-ignore
        state.currentSummary = action.payload!;
      })
      .addCase(fetchSummaryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Summary
    builder
      .addCase(updateSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSummary.fulfilled, (state, action) => {
        state.loading = false;
        const updatedSummary = action.payload;
        const index = state.summaries.findIndex(
          (s) => s._id === updatedSummary._id
        );
        if (index !== -1) {
          state.summaries[index] = updatedSummary;
        }
        if (state.currentSummary?._id === updatedSummary._id) {
          state.currentSummary = updatedSummary;
        }
      })
      .addCase(updateSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Retry Summary
    builder
      .addCase(retrySummaryProcessing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(retrySummaryProcessing.fulfilled, (state, action) => {
        state.loading = false;
        // Summary will be updated via socket events
      })
      .addCase(retrySummaryProcessing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Summary
    builder
      .addCase(deleteSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summaries = state.summaries.filter(
          (s) => s._id !== action.payload
        );
        if (state.currentSummary?._id === action.payload) {
          state.currentSummary = null;
        }
      })
      .addCase(deleteSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setUploadProgress,
  addProcessingSummary,
  removeProcessingSummary,
  updateSummaryProgress,
  updateSummaryInRealTime,
  clearError,
  clearCurrentSummary,
  // Socket event handlers
  handleSummaryProgress,
  handleSummaryComplete,
  handleSummaryError,
  handleSummaryAbort,
  setCurrentSummary,
  handleSummaryStream,
} = summarySlice.actions;

export default summarySlice.reducer;
