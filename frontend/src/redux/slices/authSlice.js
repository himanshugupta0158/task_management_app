import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

const saved = JSON.parse(localStorage.getItem("auth") || "{}");
const initialState = {
  user: saved.user ?? null,
  token: saved.access ?? null,
  refreshToken: saved.refresh ?? null,
  users: [],
  status: "idle",
  error: null,
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("access");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("/users/auth/login/", credentials);
      const { access, refresh } = response.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      const profile = await axios.get("/users/me/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      localStorage.setItem("user", JSON.stringify(profile.data));
      return { user: profile.data, access, refresh };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("/users/register/", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { getState }) => {
    const refresh = getState().auth.refreshToken;
    try {
      await axios.post("/users/auth/logout/", { refresh });
    } catch (err) {
      console.error("Logout failed:", err);
    }
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    return true;
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.patch("/users/me/", data, getAuthHeaders());
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "auth/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/users/", getAuthHeaders());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.status = "succeeded";
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.status = "idle";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        const data = action.payload;
        if (Array.isArray(data.results)) {
          state.users = data.results;
        } else {
          console.error("Unexpected users data format:", data);
          state.users = [];
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        console.error("Failed to fetch users:", action.payload);
        state.users = [];
        state.status = "failed";
        state.error = action.payload || "Failed to load users";
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
