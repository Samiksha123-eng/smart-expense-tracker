import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get("/auth/profile");
      setUser(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load profile");
    }
  };

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="profile-container">

      <h1 className="profile-title">👤 My Profile</h1>

      <div className="profile-card">

        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="profile-row">
          <span>Name</span>
          <strong>{user.name}</strong>
        </div>

        <div className="profile-row">
          <span>Email</span>
          <strong>{user.email}</strong>
        </div>

        <div className="profile-row">
          <span>Monthly Budget</span>
          <strong>₹{user.monthlyBudget}</strong>
        </div>

        <button
          className="profile-btn"
          onClick={() => alert("Edit Profile Coming Soon")}
        >
          Edit Profile
        </button>

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default Profile;