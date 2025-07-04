import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";
import { toast } from "react-toastify";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch all tasks
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/tasks/", getAuthHeaders());
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Failed to fetch tasks");
  }
});

// Create new task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/tasks/", taskData, getAuthHeaders());
      toast.success("Task created successfully");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create task");
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/tasks/${taskId}/`, updates, getAuthHeaders());
      toast.success("Task updated successfully");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update task");
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      await axios.delete(`/tasks/${taskId}/`, getAuthHeaders());
      toast.success("Task deleted successfully");
      return taskId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete task");
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
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
      });
  },
});

export default taskSlice.reducer;
