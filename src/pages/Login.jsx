import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      // Save JWT Token
      localStorage.setItem("token", response.data.token);

      // Save User Info
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert(response.data.message);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Login Failed");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

      <div className="login-logo">
  <svg
    className="wallet-logo"
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="8"
      y="14"
      width="48"
      height="38"
      rx="8"
      fill="#2563EB"
    />

    <path
      d="M8 23C8 18.03 12.03 14 17 14H47C51.97 14 56 18.03 56 23V27H8V23Z"
      fill="#38BDF8"
    />

    <path
      d="M42 27H56V42H44C40.69 42 38 39.31 38 36.5C38 33.69 40.69 31 44 31H56"
      fill="#172554"
    />

    <circle
      cx="45"
      cy="36.5"
      r="2.5"
      fill="white"
    />
  </svg>
</div>


        <h1 className="login-title">
          Smart Expense Tracker
        </h1>

        <label>Email</label>

        <input
          type="email"
          className="login-input"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>

        <input
          type="password"
          className="login-input"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p
  style={{
    textAlign: "right",
    marginBottom: "15px",
  }}
>
  <span
    style={{
      color: "#2563eb",
      cursor: "pointer",
      fontWeight: "bold",
    }}
    onClick={() => navigate("/forgot-password")}
  >
    Forgot Password?
  </span>
</p>

        <button
          className="login-btn"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="register-link">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Register
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;