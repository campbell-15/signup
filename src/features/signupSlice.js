import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; // Importing createSlice and createAsyncThunk from Redux toolkit
import axios from "axios"; // Importing Axios for HTTP requests

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
        "http://localhost:5000/api/register",
        userData
      ); // Sending registration request to backend
      localStorage.removeItem("token"); // Clearing existing token
      localStorage.setItem("token", response.data.token); // Storing new token in local storage
      return response.data; // Returning response data
    } catch (error) {
      console.error("Registration error:", error.response || error.message); // Logging registration error
      return rejectWithValue(
        error.response?.data || { message: "Registration failed!" }
      ); // Returning error message
    }
  }
);

// Async thunk to handle Google login
export const googleLogin = createAsyncThunk(
  "signup/googleLogin",
  async ({ code }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/google-login",
        { code }
      ); // Sending Google login request to backend
      localStorage.removeItem("token"); // Clearing existing token
      localStorage.setItem("token", response.data.token); // Storing new token in local storage
      return response.data; // Returning response data
    } catch (error) {
      console.error("Google login error:", error.response || error.message); // Logging Google login error
      return rejectWithValue(
        error.response?.data || { message: "Google login failed!" }
      ); // Returning error message
    }
  }
);

// Creating the signup slice
const signupSlice = createSlice({
  name: "signup", // Slice name
  initialState, // Initial state
  reducers: {
    // Reducer functions for synchronous actions
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
    // Reducer functions for handling async actions
    builder
      .addCase(registerUser.fulfilled, (state) => {
        state.feedbackMessage = "Registration successful!"; // Setting feedback message on successful registration
        state.name = ""; // Clearing name field
        state.email = ""; // Clearing email field
        state.password = ""; // Clearing password field
        state.rememberMe = false; // Resetting rememberMe checkbox
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.feedbackMessage =
          action.payload?.message || "Registration failed!"; // Setting feedback message on registration failure
      })
      .addCase(googleLogin.fulfilled, (state) => {
        state.feedbackMessage = "Google login successful!"; // Setting feedback message on successful Google login
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.feedbackMessage =
          action.payload?.message || "Google login failed!"; // Setting feedback message on Google login failure
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
