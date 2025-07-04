import { createSlice } from "@reduxjs/toolkit";

const initialLogs = JSON.parse(localStorage.getItem("logs")) || [];

const logSlice = createSlice({
  name: "logs",
  initialState: { logs: initialLogs },
  reducers: {
    addLog: (state, action) => {
      const newLog = {
        id: Date.now(),
        ...action.payload,
        created_at: new Date().toISOString(),
      };
      state.logs.unshift(newLog);
      localStorage.setItem("logs", JSON.stringify(state.logs));
    },
    clearLogs: (state) => {
      state.logs = [];
      localStorage.removeItem("logs");
    },
  },
});

export const { addLog, clearLogs } = logSlice.actions;
export default logSlice.reducer;
