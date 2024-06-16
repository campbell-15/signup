import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  name: "",
  email: "",
  password: "",
  rememberMe: false,
  feedbackMessage: "",
};

export const registerUser = createAsyncThunk(
  "signup/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/register", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const googleLogin = createAsyncThunk(
  "signup/googleLogin",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/google-login", { token });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

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
      .addCase(registerUser.fulfilled, (state, action) => {
        state.feedbackMessage = "Registration successful!";
        state.name = "";
        state.email = "";
        state.password = "";
        state.rememberMe = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.feedbackMessage = action.payload.message || "Registration failed!";
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.feedbackMessage = "Google login successful!";
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.feedbackMessage = action.payload.message || "Google login failed!";
      });
  },
});

export const {
  setName,
  setEmail,
  setPassword,
  setRememberMe,
  resetForm,
  setFeedbackMessage,
  clearFeedbackMessage,
} = signupSlice.actions;
export default signupSlice.reducer;
