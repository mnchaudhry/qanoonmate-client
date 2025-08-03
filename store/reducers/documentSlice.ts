import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../api';
import toast from 'react-hot-toast';
import type {
    Document,
    CreateDocumentRequest,
    CreateDocumentResponse,
    GetDocumentsRequest,
    GetDocumentsResponse,
    UpdateDocumentRequest,
    UpdateDocumentResponse,
    DeleteDocumentResponse,
    BatchDeleteRequest,
    BatchDeleteResponse,
    ShareDocumentRequest,
    ShareDocumentResponse,
    LinkToConsultationRequest,
    LinkDocumentResponse,
    ExtractMetadataRequest,
    ExtractMetadataResponse,
    ScanVirusRequest,
    ScanVirusResponse,
    PaginationMeta,
    Directory,
    DirectoryCreateInput,
    DirectoryResponse,
    DirectoryListResponse,
    DirectoryUpdateInput,
    DirectoryDeleteResponse
} from '../types/api';

interface DocumentState {
    documents: Document[];
    selectedDocument: Document | null;
    loading: boolean;
    error: string | null;
    meta?: PaginationMeta;
    filters?: GetDocumentsRequest;
    directories: Directory[];
    selectedDirectory: Directory | null;
    directoryLoading: boolean;
    directoryError: string | null;
    uploadLoading: boolean;
    uploadProgress: number;
    currentPath: string[];
    viewMode: 'grid' | 'list';
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    searchQuery: string;
}

const initialState: DocumentState = {
    documents: [],
    selectedDocument: null,
    loading: false,
    error: null,
    meta: undefined,
    filters: undefined,
    directories: [],
    selectedDirectory: null,
    directoryLoading: false,
    directoryError: null,
    uploadLoading: false,
    uploadProgress: 0,
    currentPath: ['Documents'],
    viewMode: 'grid',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    searchQuery: '',
};

// Document Actions
export const fetchDocuments = createAsyncThunk<GetDocumentsResponse, GetDocumentsRequest | undefined>('document/fetchDocuments', async (filters, { rejectWithValue }) => {
    try {
        const { data } = await api.getDocuments(filters);
        return data;
    } catch (e: any) {
        toast.error(e.message || 'Failed to fetch documents');
        return rejectWithValue(e.message);
    }
});

export const fetchDocumentById = createAsyncThunk<Document, string>('document/fetchDocumentById', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.getDocumentById(id);
        return data.data;
    } catch (e: any) {
        toast.error(e.message || 'Failed to fetch document');
        return rejectWithValue(e.message);
    }
});

export const createDocument = createAsyncThunk<CreateDocumentResponse, CreateDocumentRequest>('document/createDocument', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.createDocument(formData);
        toast.success('Document uploaded successfully');
        return data;
    } catch (e: any) {
        toast.error(e.message || 'Failed to upload document');
        return rejectWithValue(e.message);
    }
});

export const updateDocument = createAsyncThunk<UpdateDocumentResponse, { id: string; data: FormData }>('document/updateDocument', async ({ id, data }, { rejectWithValue }) => {
    try {
        const { data: res } = await api.updateDocument(id, data);
        toast.success('Document updated successfully');
        return res;
    } catch (e: any) {
        toast.error(e.message || 'Failed to update document');
        return rejectWithValue(e.message);
    }
});

export const deleteDocument = createAsyncThunk<DeleteDocumentResponse, string>('document/deleteDocument', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.deleteDocument(id);
        toast.success('Document deleted successfully');
        return data;
    } catch (e: any) {
        toast.error(e.message || 'Failed to delete document');
        return rejectWithValue(e.message);
    }
});

export const batchDeleteDocuments = createAsyncThunk<BatchDeleteResponse, BatchDeleteRequest>('document/batchDeleteDocuments', async (data, { rejectWithValue }) => {
    try {
        const { data: res } = await api.batchDeleteDocuments(data);
        toast.success('Documents deleted successfully');
        return res;
    } catch (e: any) {
        toast.error(e.message || 'Failed to delete documents');
        return rejectWithValue(e.message);
    }
});

export const shareDocument = createAsyncThunk<ShareDocumentResponse, ShareDocumentRequest>('document/shareDocument', async (data, { rejectWithValue }) => {
    try {
        const { data: res } = await api.shareDocument(data);
        toast.success('Document shared successfully');
        return res;
    } catch (e: any) {
        toast.error(e.message || 'Failed to share document');
        return rejectWithValue(e.message);
    }
});

export const linkToConsultation = createAsyncThunk<LinkDocumentResponse, LinkToConsultationRequest>('document/linkToConsultation', async (data, { rejectWithValue }) => {
    try {
        const { data: res } = await api.linkToConsultation(data);
        toast.success('Document linked to consultation');
        return res;
    } catch (e: any) {
        toast.error(e.message || 'Failed to link document');
        return rejectWithValue(e.message);
    }
});

export const extractMetadata = createAsyncThunk<ExtractMetadataResponse, ExtractMetadataRequest>('document/extractMetadata', async (data, { rejectWithValue }) => {
    try {
        const { data: res } = await api.extractMetadata(data);
        toast.success('Metadata extracted successfully');
        return res;
    } catch (e: any) {
        toast.error(e.message || 'Failed to extract metadata');
        return rejectWithValue(e.message);
    }
});

export const scanVirus = createAsyncThunk<ScanVirusResponse, ScanVirusRequest>('document/scanVirus', async (data, { rejectWithValue }) => {
    try {
        const { data: res } = await api.scanVirus(data);
        toast.success('Virus scan completed');
        return res;
    } catch (e: any) {
        toast.error(e.message || 'Failed to scan document');
        return rejectWithValue(e.message);
    }
});

export const adminGetDocuments = createAsyncThunk<GetDocumentsResponse, GetDocumentsRequest | undefined>('document/adminGetDocuments', async (filters, { rejectWithValue }) => {
    try {
        const { data } = await api.adminGetDocuments(filters);
        return data;
    } catch (e: any) {
        toast.error(e.message || 'Failed to fetch admin documents');
        return rejectWithValue(e.message);
    }
});

export const adminDeleteDocument = createAsyncThunk<DeleteDocumentResponse, string>('document/adminDeleteDocument', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.adminDeleteDocument(id);
        toast.success('Document deleted by admin');
        return data;
    } catch (e: any) {
        toast.error(e.message || 'Failed to delete document');
        return rejectWithValue(e.message);
    }
});

// Directory Actions
export const fetchDirectories = createAsyncThunk<DirectoryListResponse, { ownerId: string; parentId?: string }>('document/fetchDirectories', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.getDirectories(params);
        return data;
    } catch (e: any) {
        toast.error(e.message || 'Failed to fetch directories');
        return rejectWithValue(e.message);
    }
});

export const createDirectory = createAsyncThunk<DirectoryResponse, DirectoryCreateInput>('document/createDirectory', async (input, { rejectWithValue }) => {
    try {
        const { data } = await api.createDirectory(input);
        toast.success('Directory created successfully');
        return data;
    } catch (e: any) {
        toast.error(e.message || 'Failed to create directory');
        return rejectWithValue(e.message);
    }
});

export const updateDirectory = createAsyncThunk<DirectoryResponse, { id: string; data: DirectoryUpdateInput }>('document/updateDirectory', async ({ id, data }, { rejectWithValue }) => {
    try {
        const { data: res } = await api.updateDirectory(id, data);
        toast.success('Directory updated successfully');
        return res;
    } catch (e: any) {
        toast.error(e.message || 'Failed to update directory');
        return rejectWithValue(e.message);
    }
});

export const deleteDirectory = createAsyncThunk<DirectoryDeleteResponse, string>('document/deleteDirectory', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.deleteDirectory(id);
        toast.success('Directory deleted successfully');
        return data;
    } catch (e: any) {
        toast.error(e.message || 'Failed to delete directory');
        return rejectWithValue(e.message);
    }
});

const documentSlice = createSlice({
    name: 'document',
    initialState,
    reducers: {
        setDocuments(state, action: PayloadAction<Document[]>) {
            state.documents = action.payload;
        },
        setSelectedDocument(state, action: PayloadAction<Document | null>) {
            state.selectedDocument = action.payload;
        },
        clearDocuments(state) {
            state.documents = [];
            state.selectedDocument = null;
        },
        resetState: () => initialState,
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        setMeta(state, action: PayloadAction<PaginationMeta | undefined>) {
            state.meta = action.payload;
        },
        setFilters(state, action: PayloadAction<GetDocumentsRequest | undefined>) {
            state.filters = action.payload;
        },
        setDirectories(state, action: PayloadAction<Directory[]>) {
            state.directories = action.payload;
        },
        setSelectedDirectory(state, action: PayloadAction<Directory | null>) {
            state.selectedDirectory = action.payload;
        },
        clearDirectories(state) {
            state.directories = [];
            state.selectedDirectory = null;
        },
        setDirectoryError(state, action: PayloadAction<string | null>) {
            state.directoryError = action.payload;
        },
        resetDirectoryState(state) {
            state.directories = [];
            state.selectedDirectory = null;
            state.directoryLoading = false;
            state.directoryError = null;
        },
        setUploadLoading(state, action: PayloadAction<boolean>) {
            state.uploadLoading = action.payload;
        },
        setUploadProgress(state, action: PayloadAction<number>) {
            state.uploadProgress = action.payload;
        },
        setCurrentPath(state, action: PayloadAction<string[]>) {
            state.currentPath = action.payload;
        },
        setViewMode(state, action: PayloadAction<'grid' | 'list'>) {
            state.viewMode = action.payload;
        },
        setSortBy(state, action: PayloadAction<string>) {
            state.sortBy = action.payload;
        },
        setSortOrder(state, action: PayloadAction<'asc' | 'desc'>) {
            state.sortOrder = action.payload;
        },
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            // Document Actions
            .addCase(fetchDocuments.pending, s => { s.loading = true; s.error = null; })
            .addCase(fetchDocuments.fulfilled, (s, a) => {
                s.loading = false;
                s.documents = a.payload.data;
                s.meta = a.payload.meta;
            })
            .addCase(fetchDocuments.rejected, (s, a) => {
                s.loading = false; s.error = String(a.payload);
            })
            .addCase(fetchDocumentById.fulfilled, (s, a) => {
                s.selectedDocument = a.payload;
            })
            .addCase(createDocument.pending, s => { s.uploadLoading = true; s.uploadProgress = 0; })
            .addCase(createDocument.fulfilled, (s, a) => {
                s.uploadLoading = false;
                s.uploadProgress = 100;
                s.documents.unshift(a.payload.data);
            })
            .addCase(createDocument.rejected, s => { s.uploadLoading = false; s.uploadProgress = 0; })
            .addCase(updateDocument.fulfilled, (s, a) => {
                const idx = s.documents.findIndex(x => x._id === a.payload.data._id);
                if (idx > -1) s.documents[idx] = a.payload.data;
                if (s.selectedDocument && s.selectedDocument._id === a.payload.data._id) s.selectedDocument = a.payload.data;
            })
            .addCase(deleteDocument.fulfilled, (s, a) => {
                s.documents = s.documents.filter(d => d._id !== a.payload.data._id);
                if (s.selectedDocument && s.selectedDocument._id === a.payload.data._id) s.selectedDocument = null;
            })
            .addCase(batchDeleteDocuments.fulfilled, (s, a) => {
                s.documents = s.documents.filter(d => !a.payload.data.includes(d));
                if (s.selectedDocument && a.payload.data.includes(s.selectedDocument)) s.selectedDocument = null;
            })
            .addCase(shareDocument.fulfilled, (s, a) => {
                const idx = s.documents.findIndex(x => x._id === a.payload.data._id);
                if (idx > -1) s.documents[idx] = a.payload.data;
                if (s.selectedDocument && s.selectedDocument._id === a.payload.data._id) s.selectedDocument = a.payload.data;
            })
            .addCase(linkToConsultation.fulfilled, (s, a) => {
                const idx = s.documents.findIndex(x => x._id === a.payload.data._id);
                if (idx > -1) s.documents[idx] = a.payload.data;
                if (s.selectedDocument && s.selectedDocument._id === a.payload.data._id) s.selectedDocument = a.payload.data;
            })
            .addCase(adminGetDocuments.fulfilled, (s, a) => {
                s.documents = a.payload.data;
                s.meta = a.payload.meta;
            })
            .addCase(adminDeleteDocument.fulfilled, (s, a) => {
                s.documents = s.documents.filter(d => d._id !== a.payload.data._id);
                if (s.selectedDocument && s.selectedDocument._id === a.payload.data._id) s.selectedDocument = null;
            })
            // Directory Actions
            .addCase(fetchDirectories.pending, s => { s.directoryLoading = true; s.directoryError = null; })
            .addCase(fetchDirectories.fulfilled, (s, a) => {
                s.directoryLoading = false;
                s.directories = a.payload.data;
            })
            .addCase(fetchDirectories.rejected, (s, a) => {
                s.directoryLoading = false; s.directoryError = String(a.payload);
            })
            .addCase(createDirectory.fulfilled, (s, a) => {
                s.directories.unshift(a.payload.data);
            })
            .addCase(updateDirectory.fulfilled, (s, a) => {
                const idx = s.directories.findIndex(x => x._id === a.payload.data._id);
                if (idx > -1) s.directories[idx] = a.payload.data;
                if (s.selectedDirectory && s.selectedDirectory._id === a.payload.data._id) s.selectedDirectory = a.payload.data;
            })
            .addCase(deleteDirectory.fulfilled, (s, a) => {
                s.directories = s.directories.filter(d => d._id !== a.payload.data._id);
                if (s.selectedDirectory && s.selectedDirectory._id === a.payload.data._id) s.selectedDirectory = null;
            });
    },
});

export const {
    setDocuments, setSelectedDocument, clearDocuments, resetState, setError, setMeta, setFilters,
    setDirectories, setSelectedDirectory, clearDirectories, setDirectoryError, resetDirectoryState,
    setUploadLoading, setUploadProgress, setCurrentPath, setViewMode, setSortBy, setSortOrder, setSearchQuery
} = documentSlice.actions;
export default documentSlice.reducer; 