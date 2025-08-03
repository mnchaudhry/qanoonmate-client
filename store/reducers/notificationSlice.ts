import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../api';
import toast from 'react-hot-toast';
import type { Notification, CreateNotificationRequest, GetNotificationsRequest, GetNotificationsResponse, PaginationMeta } from '../types/api';

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
    isInitialLoaded: boolean;
    lastFetched: number | null;
    meta?: PaginationMeta;
    filters?: GetNotificationsRequest;
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    isInitialLoaded: false,
    lastFetched: null,
    meta: undefined,
    filters: undefined,
};

export const fetchNotifications = createAsyncThunk<
    { notifications: Notification[]; meta?: GetNotificationsResponse['meta']; },
    GetNotificationsRequest | undefined
>('notification/fetchNotifications', async (filters, { rejectWithValue }) => {
    try {
        const { data } = await api.getNotifications(filters);
        return { notifications: data.data, meta: data.meta };
    } catch (e: any) {
        toast.error(e.message);
        return rejectWithValue(e.message);
    }
});

export const fetchUnreadCount = createAsyncThunk<number>('notification/fetchUnreadCount', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.getUnreadCount();
        return data.data.count;
    } catch (e: any) {
        toast.error(e.message);
        return rejectWithValue(e.message);
    }
}
);

export const createNotification = createAsyncThunk<Notification, CreateNotificationRequest>('notification/createNotification', async (input, { rejectWithValue }) => {
    try {
        const { data } = await api.createNotification(input);
        toast.success('Notification sent');
        return data.data;
    } catch (e: any) {
        toast.error(e.message);
        return rejectWithValue(e.message);
    }
}
);

export const markNotificationAsRead = createAsyncThunk<Notification | null, string>('notification/markAsRead', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.markAsRead(id);
        return data.data;
    } catch (e: any) {
        toast.error(e.message);
        return rejectWithValue(e.message);
    }
}
);

export const markNotificationAsUnread = createAsyncThunk<Notification | null, string>('notification/markAsUnread', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.markAsUnread(id);
        return data.data;
    } catch (e: any) {
        toast.error(e.message);
        return rejectWithValue(e.message);
    }
}
);

export const deleteNotification = createAsyncThunk<string, string>('notification/deleteNotification', async (id, { rejectWithValue }) => {
    try {
        await api.deleteNotification(id);
        toast.success('Notification deleted');
        return id;
    } catch (e: any) {
        toast.error(e.message);
        return rejectWithValue(e.message);
    }
}
);

export const bulkMarkAsRead = createAsyncThunk<string[], string[]>('notification/bulkMarkAsRead', async (ids, { rejectWithValue }) => {
    try {
        await api.bulkMarkAsRead(ids);
        toast.success('Marked as read');
        return ids;
    } catch (e: any) {
        toast.error(e.message);
        return rejectWithValue(e.message);
    }
}
);

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotifications(state, action: PayloadAction<Notification[]>) {
            state.notifications = action.payload;
        },
        setUnreadCount(state, action: PayloadAction<number>) {
            state.unreadCount = action.payload;
        },
        addNotification(state, action: PayloadAction<Notification>) {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        removeNotification(state, action: PayloadAction<string>) {
            state.notifications = state.notifications.filter(n => n._id !== action.payload);
        },
        markReadLocal(state, action: PayloadAction<string>) {
            const n = state.notifications.find(n => n._id === action.payload);
            if (n && !n.isRead) { n.isRead = true; state.unreadCount = Math.max(0, state.unreadCount - 1); }
        },
        markUnreadLocal(state, action: PayloadAction<string>) {
            const n = state.notifications.find(n => n._id === action.payload);
            if (n && n.isRead) { n.isRead = false; state.unreadCount += 1; }
        },
        clearNotifications(state) {
            state.notifications = [];
            state.unreadCount = 0;
        },
        resetState: () => initialState,
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        setInitialLoaded(state, action: PayloadAction<boolean>) {
            state.isInitialLoaded = action.payload;
        },
        setLastFetched(state, action: PayloadAction<number | null>) {
            state.lastFetched = action.payload;
        },
        setMeta(state, action: PayloadAction<GetNotificationsResponse['meta'] | undefined>) {
            state.meta = action.payload;
        },
        setFilters(state, action: PayloadAction<GetNotificationsRequest | undefined>) {
            state.filters = action.payload;
        },
        // Real-time (socket) handlers
        socketNewNotification(state, action: PayloadAction<Notification>) {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        socketMarkRead(state, action: PayloadAction<string>) {
            const n = state.notifications.find(n => n._id === action.payload);
            if (n && !n.isRead) { n.isRead = true; state.unreadCount = Math.max(0, state.unreadCount - 1); }
        },
        socketMarkUnread(state, action: PayloadAction<string>) {
            const n = state.notifications.find(n => n._id === action.payload);
            if (n && n.isRead) { n.isRead = false; state.unreadCount += 1; }
        },
        socketDeleteNotification(state, action: PayloadAction<string>) {
            state.notifications = state.notifications.filter(n => n._id !== action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchNotifications.pending, s => { s.loading = true; s.error = null; })
            .addCase(fetchNotifications.fulfilled, (s, a) => {
                s.loading = false;
                s.notifications = a.payload.notifications;
                s.meta = a.payload.meta;
                s.isInitialLoaded = true;
                s.lastFetched = Date.now();
            })
            .addCase(fetchNotifications.rejected, (s, a) => { s.loading = false; s.error = String(a.payload); })
            .addCase(fetchUnreadCount.fulfilled, (s, a) => { s.unreadCount = a.payload; })
            .addCase(createNotification.fulfilled, (s, a) => { s.notifications.unshift(a.payload); })
            .addCase(markNotificationAsRead.fulfilled, (s, a) => {
                const n = a.payload; if (n) { const idx = s.notifications.findIndex(x => x._id === n._id); if (idx > -1) { s.notifications[idx] = n; } s.unreadCount = Math.max(0, s.unreadCount - 1); }
            })
            .addCase(markNotificationAsUnread.fulfilled, (s, a) => {
                const n = a.payload; if (n) { const idx = s.notifications.findIndex(x => x._id === n._id); if (idx > -1) { s.notifications[idx] = n; } s.unreadCount += 1; }
            })
            .addCase(deleteNotification.fulfilled, (s, a) => {
                if (a.payload) s.notifications = s.notifications.filter(n => n._id !== a.payload);
            })
            .addCase(bulkMarkAsRead.fulfilled, (s, a) => {
                if (a.payload) {
                    a.payload.forEach(id => {
                        const n = s.notifications.find(x => x._id === id);
                        if (n && !n.isRead) { n.isRead = true; s.unreadCount = Math.max(0, s.unreadCount - 1); }
                    });
                }
            });
    },
});

export const {
    setNotifications, setUnreadCount, addNotification, removeNotification, markReadLocal, markUnreadLocal, clearNotifications, resetState, setError, setInitialLoaded, setLastFetched, setMeta, setFilters,
    socketNewNotification, socketMarkRead, socketMarkUnread, socketDeleteNotification
} = notificationSlice.actions;
export default notificationSlice.reducer; 