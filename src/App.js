import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setName,
  setEmail,
  setPassword,
  setRememberMe,
  resetForm,
  setFeedbackMessage,
  registerUser,
  googleLogin,
} from "./features/signupSlice";
import logo from "./assets/Logo.png";
import google from "./assets/google.png";
import background from "./assets/Image.png";
import WebFont from "webfontloader";
import { useGoogleLogin } from "@react-oauth/google";

WebFont.load({
  google: {
    families: ["Bebas Neue", "Urbanist", "Cabin"],
  },
});

const App = () => {
  const dispatch = useDispatch();
  const { name, email, password, rememberMe, feedbackMessage } = useSelector(
    (state) => state.signup
  );
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const strength = evaluatePasswordStrength(password);
    const isUnique = checkPasswordUniqueness(password);

    if (strength === "Weak" || !isUnique) {
      setPasswordError("Please choose a stronger and unique password.");
      return;
    }

    dispatch(registerUser({ name, email, password, rememberMe }))
      .unwrap()
      .then(() => {
        dispatch(resetForm());
      })
      .catch((error) => {
        dispatch(setFeedbackMessage(error.message || "Registration failed!"));
      });
  };

  const evaluatePasswordStrength = (password) => {
    if (password.length < 6) {
      return "Weak";
    } else if (password.length >= 6 && password.length < 12) {
      return "Moderate";
    } else {
      return "Strong";
    }
  };

  const checkPasswordUniqueness = (password) => {
    const commonPasswords = [
      "123456",
      "password",
      "123456789",
      "12345678",
      "12345",
    ];
    return !commonPasswords.includes(password);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    dispatch(setPassword(newPassword));
    const strength = evaluatePasswordStrength(newPassword);
    setPasswordStrength(strength);
    setPasswordError("");
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      dispatch(googleLogin({ token: codeResponse.code }))
        .unwrap()
        .then(() => {
          dispatch(setFeedbackMessage("Google login successful!"));
        })
        .catch((error) => {
          dispatch(setFeedbackMessage(error.message || "Google login failed!"));
        });
    },
    flow: "auth-code",
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200">
      <div className="flex flex-col lg:flex-row w-full lg:w-5/6 max-w-5xl bg-white shadow-lg rounded-[40px] overflow-hidden">
        <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8 bg-white relative">
          <div className="absolute top-8 left-8">
            <img src={logo} alt="Ruix Logo" className="w-28 h-auto" />
          </div>
          <div className="mt-24 w-4/5 lg:w-3/4 text-center">
            <h2 className="text-5xl font-normal mb-2 Bebas">SIGN UP</h2>
            <p className="text-gray-600 mb-12 Urbanist">
              Create an account to get started.
            </p>
            <button
              className="flex items-center justify-center w-full py-2 mb-6 border border-gray-300 rounded-md hover:bg-gray-100"
              onClick={() => login()}
            >
              <img className="w-5 h-5 mr-2" src={google} alt="Google Logo" />
              <p className="font-cabin text-xs font-extralight">
                Continue With Google
              </p>
            </button>
            <div className="flex items-center justify-center w-full mb-6">
              <hr className="w-1/4 sm:w-1/5 border-t border-gray-300 my-0 mr-2" />
              <span className="px-2 text-gray-400 text-sm">Or</span>
              <hr className="w-1/4 sm:w-1/5 border-t border-gray-300 my-0 ml-2" />
            </div>
            <form className="w-full flex flex-col mb-4" onSubmit={handleSubmit}>
              <input
                className="px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 font-cabin"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => dispatch(setName(e.target.value))}
                required
                aria-label="Name"
              />
              <input
                className="px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 font-cabin"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => dispatch(setEmail(e.target.value))}
                required
                aria-label="Email"
              />
              <input
                className="px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 font-cabin"
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                required
                aria-label="Password"
              />
              <p className="text-xs text-gray-600 font-cabin mb-3">
                {passwordError ? (
                  <span className="text-red-600">{passwordError}</span>
                ) : isPasswordFocused ? (
                  `Password strength: ${passwordStrength}`
                ) : null}
              </p>
              <div className="flex items-center mb-4">
                <input
                  className="mr-2"
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => dispatch(setRememberMe(e.target.checked))}
                />
                <label
                  className="text-gray-600 text-sm font-cabin"
                  htmlFor="remember-me"
                >
                  Remember Me
                </label>
              </div>
              <button
                className="w-full py-2 bg-black text-white rounded-full hover:bg-gray-800"
                type="submit"
              >
                <p className="text-sm m-0">Register</p>
              </button>
            </form>
            <p className="text-xs text-gray-600 font-cabin mb-4">
              {feedbackMessage}
            </p>
            <p className="text-gray-600 mb-12 Urbanist">
              Already have an account?{" "}
              <a
                className="text-yellow-500 hover:underline Urbanist font-bold"
                href="{}"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
        <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center bg-gray-200 rounded-lg lg:rounded-none">
          <div className="w-full h-full">
            <img
              className="w-full h-full object-cover rounded-lg lg:rounded-none"
              src={background}
              alt="Artistic Background"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
