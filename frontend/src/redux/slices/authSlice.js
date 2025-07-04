import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

// Initial State
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("access") || null,
  refreshToken: localStorage.getItem("refresh") || null,
  users: [],
  status: "idle",
  error: null,
};

// Async Thunks

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("/users/auth/login/", credentials);
      const { access, refresh } = response.data;
      const profile = await axios.get("/users/me/", {
        headers: { Authorization: `Bearer ${access}` },
      });

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(profile.data));

      return {
        user: profile.data,
        token: access,
        refreshToken: refresh,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Login failed");
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
      // Ignore failure, clear storage anyway
    }
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    return true;
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (updatedData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.patch("/users/me/", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "auth/fetchUsers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.get("/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Fetching users failed");
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Login
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Register
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

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.status = "idle";
      })

      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
