import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import validator from "validator";
import "../../styles/auth.css";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isStrong, setIsStrong] = useState(false);
  const Navigate = useNavigate();

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
      await axios.post("http://localhost:5000/auth/signup", {
        username,
        email,
        password,
      });
      setMessage("Signup successful");
      setTimeout(() => Navigate("/"), 1000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            className="signup-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className="input-group">
            <input
              className={`signup-input ${emailError? "input-error": isValid && email.length > 0 ? "input-valid": "" }`}
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
              className={`signup-input ${
                !isStrong && password.length > 0
                  ? "input-error"
                  : isStrong
                  ? "input-valid"
                  : ""
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
                Password must be at least 8 characters, include uppercase,
                lowercase, number, and symbol.
              </div>
            )}
            {isStrong && password.length > 0 && (
              <div className="valid-indicator">Password is strong</div>
            )}
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        {message && <div className="signup-message">{message}</div>}
        <p className="signup-text">
          Already have an account?{" "}
          <a href="/" className="signup-link">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
