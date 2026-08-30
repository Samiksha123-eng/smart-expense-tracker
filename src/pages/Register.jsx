import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    // Check all fields
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    // Check passwords
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      alert(response.data.message);

      // Go back to Login page
      navigate("/");
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Registration Failed");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <h1 className="register-title">Register</h1>

        <label>Name</label>
        <input
          type="text"
          className="register-input"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          className="register-input"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          className="register-input"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          className="register-input"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          className="register-btn"
          onClick={handleRegister}
        >
          Register
        </button>

        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;