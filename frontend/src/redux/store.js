import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import taskReducer from "./slices/taskSlice";
import notificationReducer from "./slices/notificationSlice";
import logReducer from "./slices/logSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    notifications: notificationReducer,
    logs: logReducer,
  },
});

export default store;
