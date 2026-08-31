import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [switchingAccount, setSwitchingAccount] = useState(null);

  useEffect(() => {
    const savedAccount = localStorage.getItem("switchingAccount");

    if (savedAccount) {
      try {
        const account = JSON.parse(savedAccount);

        setSwitchingAccount(account);
        setEmail(account.email || "");
      } catch (error) {
        console.error("Error reading switching account:", error);
        localStorage.removeItem("switchingAccount");
      }
    }
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await API.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const loggedInUser = response.data.user;
      const token = response.data.token;

      // Save current authentication
      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      // Remove temporary switching information
      localStorage.removeItem("switchingAccount");

      // Save account identity for future account switching
      const existingAccounts = JSON.parse(
        localStorage.getItem("savedAccounts") || "[]"
      );

      const existingAccountIndex = existingAccounts.findIndex(
        (account) => account.email === loggedInUser.email
      );

      const accountData = {
        id: loggedInUser.id,
        name: loggedInUser.name,
        email: loggedInUser.email,
      };

      if (existingAccountIndex === -1) {
        existingAccounts.push(accountData);
      } else {
        existingAccounts[existingAccountIndex] = accountData;
      }

      localStorage.setItem(
        "savedAccounts",
        JSON.stringify(existingAccounts)
      );

      alert(response.data.message);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(
          error.response.data.message ||
            "Invalid Email or Password"
        );
      } else {
        alert("Login Failed");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        {/* Logo */}
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

        {/* Title */}
        <h1 className="login-title">
          Smart Expense Tracker
        </h1>

        {/* Switching Account Message */}
        {switchingAccount && (
          <p className="switch-account-message">
            🔄 Switching to{" "}
            <strong>{switchingAccount.name}</strong>
          </p>
        )}

        {/* Email */}
        <label>Email</label>

        <input
          type="email"
          className="login-input"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Password */}
        <label>Password</label>

        <input
          type="password"
          className="login-input"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Forgot Password */}
        <p className="forgot-password-link">
          <span
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>
        </p>

        {/* Login */}
        <button
          className="login-btn"
          onClick={handleLogin}
        >
          {switchingAccount
            ? "Switch Account"
            : "Login"}
        </button>

        {/* Register */}
        <p className="register-link">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;