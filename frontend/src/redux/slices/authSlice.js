import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

// Initial State
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  status: "idle",
  error: null,
};

// Login (JWT)
export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/users/auth/login/", {
        username,
        password,
      });
      const { access, refresh } = response.data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      const userResponse = await axios.get("/users/me/");
      localStorage.setItem("user", JSON.stringify(userResponse.data));
      return userResponse.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Login failed");
    }
  }
);

// Register
export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      await axios.post("/users/register/", payload);
      return await login(payload); // Auto login
    } catch (err) {
      return rejectWithValue(err.response?.data || "Registration failed");
    }
  }
);

// Update Profile
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (updatedData, { rejectWithValue }) => {
    try {
      const res = await axios.put("/users/me/", updatedData);
      localStorage.setItem("user", JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Update failed");
    }
  }
);

// Logout (API + Local)
export const logout = createAsyncThunk(
  "auth/logoutAPI",
  async (_, { rejectWithValue }) => {
    try {
      const refresh = localStorage.getItem("refreshToken");
      if (refresh) {
        await axios.post("/users/auth/logout/", { refresh });
      }
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } catch (err) {
      return rejectWithValue(err.response?.data || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutLocal: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // REGISTER
      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // UPDATE PROFILE
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logoutAPI.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { logoutLocal } = authSlice.actions;
export { login, register, logout, updateUserProfile };
export default authSlice.reducer;
