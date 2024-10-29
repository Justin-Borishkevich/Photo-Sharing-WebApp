import React, { useState } from "react";
import axios from "axios";

function LoginRegister({ onLogin }) {
    const [loginName, setLoginName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
  
    const handleLogin = async () => {
      try {
        const response = await axios.post("/admin/login", {
          login_name: loginName,
          password,
        });
        onLogin(response.data.user); // This now notifies PhotoShare of login success
      } catch (err) {
        setError("Login failed. Please try again.");
      }
    };
  
    return (
      <div>
        <input
          type="text"
          placeholder="Login Name"
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {error && <p>{error}</p>}
      </div>
    );
  }
  
  export default LoginRegister;
  