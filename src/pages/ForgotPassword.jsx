import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async () => {
    if (!email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await API.put("/auth/forgot-password", {
        email,
        password,
      });

      alert(response.data.message);

      navigate("/");
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Password Reset Failed");
      }
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">

        <h1 className="forgot-title">
          Forgot Password
        </h1>

        <label>Email</label>
        <input
          type="email"
          className="forgot-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>New Password</label>
        <input
          type="password"
          className="forgot-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          className="forgot-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          className="forgot-btn"
          onClick={handleReset}
        >
          Reset Password
        </button>

      </div>
    </div>
  );
}

export default ForgotPassword;