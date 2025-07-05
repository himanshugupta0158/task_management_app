import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/notifications/");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch notifications"
      );
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/notifications/${notificationId}/read/`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to mark notification as read"
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const raw = action.payload;

        // Normalize structure in slice itself
        if (Array.isArray(raw?.results)) {
          state.notifications = raw.results.map((n) => ({
            ...n,
            created_at: new Date(n.created_at).toISOString(), // Ensure consistent format
          }));
        } else if (Array.isArray(raw)) {
          state.notifications = raw.map((n) => ({
            ...n,
            created_at: new Date(n.created_at).toISOString(),
          }));
        } else {
          state.notifications = [];
        }
        state.status = "succeeded";
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(
          (n) => n.id === action.payload.id
        );
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
      });
  },
});

export default notificationSlice.reducer;
