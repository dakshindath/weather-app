import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import validator from "validator";
import "../../styles/auth.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isStrong, setIsStrong] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (value: string): boolean => {
    const valid = validator.isEmail(value);
    setIsValid(valid);

    if (!valid) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (value: string): boolean => {
    const strong = validator.isStrongPassword(value, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });
    setIsStrong(strong);
    return strong;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful");
      setTimeout(() => navigate("/home"), 1000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="login-container">
        <h2>Login</h2>{" "}
        <form onSubmit={handleSubmit} className="auth-form">
          {" "}
          <div className="input-group">
            <input
              className={`login-input ${
                emailError
                  ? "input-error"
                  : isValid && email.length > 0
                  ? "input-valid"
                  : ""
              }`}
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => {
                const value = e.target.value;
                setEmail(value);
                if (value) {
                  setIsValid(validator.isEmail(value));
                  validateEmail(value);
                } else {
                  setEmailError("");
                  setIsValid(false);
                }
              }}
              onBlur={() => {
                if (email) validateEmail(email);
              }}
              required
            />
            {emailError && <div className="error-message">{emailError}</div>}
            {isValid && email.length > 0 && !emailError && (
              <div className="valid-indicator">Email is valid</div>
            )}
          </div>
          <div className="input-group">
            <input
              className={`login-input ${
                !isStrong && password.length > 0 ? "input-error" : isStrong ? "input-valid" : ""
              }`}
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                validatePassword(value);
              }}
              onBlur={() => {
                if (password) validatePassword(password);
              }}
              required
            />
            {!isStrong && password.length > 0 && (
              <div className="error-message">
                Password must be at least 8 characters, include uppercase, lowercase, number, and symbol.
              </div>
            )}
            {isStrong && password.length > 0 && (
              <div className="valid-indicator">Password is strong</div>
            )}
          </div>
          <button type="submit" className="loginbutton">
            Login
          </button>
        </form>
        {message && <div className="login-message">{message}</div>}
        <p className="login-text">
          Don't have an account?{" "}
          <a href="/signup" className="login-link">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
