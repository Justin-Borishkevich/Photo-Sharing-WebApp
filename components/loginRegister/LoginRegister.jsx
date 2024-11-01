import React, { useState } from "react";
import axios from "axios";
import "./LoginRegister.css"; // Import the CSS file for styling

function LoginRegister({ onLogin }) {
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [occupation, setOccupation] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post("/admin/login", {
        login_name: loginName,
        password,
      });
      const user = response.data.user;
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post("/user", {
        login_name: loginName,
        password,
        first_name: firstName,
        last_name: lastName,
        location,
        description,
        occupation,
      });
      setError("Registration successful!");
      setLoginName("");
      setPassword("");
      setConfirmPassword("");
      setFirstName("");
      setLastName("");
      setLocation("");
      setDescription("");
      setOccupation("");
    } catch (err) {
      setError(err.response.data || "Registration failed.");
    }
  };

  return (
    <div className="login-register-container">
      <h2>{isRegistering ? "Register" : "Login"}</h2>
      {isRegistering ? (
        <>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="login-register-input"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="login-register-input"
          />
          <input
            type="text"
            placeholder="Login Name"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            className="login-register-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-register-input"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="login-register-input"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="login-register-input"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="login-register-input"
          />
          <input
            type="text"
            placeholder="Occupation"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className="login-register-input"
          />
          <button onClick={handleRegister} className="login-register-button">
            Register Me
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Login Name"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            className="login-register-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-register-input"
          />
          <button onClick={handleLogin} className="login-register-button">
            Login
          </button>
        </>
      )}
      <button
        onClick={() => setIsRegistering(!isRegistering)}
        className="login-register-toggle-button"
      >
        {isRegistering ? "Switch to Login" : "Switch to Register"}
      </button>
      {error && <p className="login-register-error">{error}</p>}
    </div>
  );
}

export default LoginRegister;
