import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Getting backend URL from environment variable
const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Initial state for the signup slice
const initialState = {
  name: "",
  email: "",
  password: "",
  rememberMe: false,
  feedbackMessage: "",
};

// Async thunk to handle user registration
export const registerUser = createAsyncThunk(
  "signup/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/register`,
        userData
      );
      localStorage.removeItem("token");
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error.response || error.message);
      return rejectWithValue(
        error.response?.data || { message: "Registration failed!" }
      );
    }
  }
);

// Async thunk to handle Google login
export const googleLogin = createAsyncThunk(
  "signup/googleLogin",
  async ({ code }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/google-login`,
        { code }
      );
      localStorage.removeItem("token");
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      console.error("Google login error:", error.response || error.message);
      return rejectWithValue(
        error.response?.data || { message: "Google login failed!" }
      );
    }
  }
);

// Creating the signup slice
const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
    },
    resetForm: (state) => {
      state.name = "";
      state.email = "";
      state.password = "";
      state.rememberMe = false;
    },
    setFeedbackMessage: (state, action) => {
      state.feedbackMessage = action.payload;
    },
    clearFeedbackMessage: (state) => {
      state.feedbackMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state) => {
        state.feedbackMessage = "Registration successful!";
        state.name = "";
        state.email = "";
        state.password = "";
        state.rememberMe = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.feedbackMessage =
          action.payload?.message || "Registration failed!";
      })
      .addCase(googleLogin.fulfilled, (state) => {
        state.feedbackMessage = "Google login successful!";
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.feedbackMessage =
          action.payload?.message || "Google login failed!";
      });
  },
});

// Exporting action creators and reducer from signupSlice
export const {
  setName,
  setEmail,
  setPassword,
  setRememberMe,
  resetForm,
  setFeedbackMessage,
  clearFeedbackMessage,
} = signupSlice.actions;
export default signupSlice.reducer; // Exporting the reducer function
