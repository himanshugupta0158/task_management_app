import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(
        Object.entries(filters).filter(([_, v]) => v)
      ).toString();
      const response = await axios.get(`/tasks/?${params}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch tasks");
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/tasks/", data, getAuthHeaders());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create task");
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/tasks/${taskId}/`,
        updates,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update task");
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      await axios.delete(`/tasks/${taskId}/`, getAuthHeaders());
      return taskId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete task");
    }
  }
);

export const fetchTaskStats = createAsyncThunk(
  "tasks/fetchTaskStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/tasks/stats/", getAuthHeaders());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch task stats"
      );
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    status: "idle",
    error: null,
    stats: {
      created: 0,
      assigned: 0,
      completed: 0,
      pending: 0,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = Array.isArray(action.payload?.results)
          ? action.payload.results
          : [];
        state.status = "succeeded";
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      })
      .addCase(fetchTaskStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default taskSlice.reducer;
