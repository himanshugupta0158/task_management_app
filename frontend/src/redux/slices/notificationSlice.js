import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

export const fetchNotifications = createAsyncThunk("notifications/fetchNotifications", async () => {
  const res = await axios.get("/notifications/");
  return res.data;
});

const notificationSlice = createSlice({
  name: "notifications",
  initialState: { notifications: [], status: "idle", error: null },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push({ ...action.payload, isRead: false });
    },
    markAsRead: (state, action) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif) notif.isRead = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.status = "succeeded";
      });
  },
});

export const { addNotification, markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
