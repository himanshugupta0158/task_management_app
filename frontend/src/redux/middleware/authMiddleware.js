import {
  login,
  logout,
  register,
  updateUserProfile,
} from "../slices/authSlice";

export const authMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (
    login.fulfilled.match(action) ||
    updateUserProfile.fulfilled.match(action)
  ) {
    const auth = store.getState().auth;
    localStorage.setItem(
      "auth",
      JSON.stringify({
        user: auth.user,
        access: auth.token,
        refresh: auth.refreshToken,
      })
    );
  }
  if (logout.fulfilled.match(action)) {
    localStorage.removeItem("auth");
  }
  return result;
};
