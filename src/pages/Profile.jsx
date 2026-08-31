import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get("/auth/profile");

      setUser(response.data);

      setName(response.data.name);
      setEmail(response.data.email);
    } catch (error) {
      console.error(error);
      alert("Failed to load profile");
    }
  };

  const handleEdit = () => {
    setName(user.name);
    setEmail(user.email);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      if (!name.trim()) {
        alert("Please enter your name!");
        return;
      }

      if (!email.trim()) {
        alert("Please enter your email!");
        return;
      }

      const response = await API.put("/auth/profile", {
        name: name.trim(),
        email: email.trim(),
      });

      setUser(response.data.user);

      setName(response.data.user.name);
      setEmail(response.data.user.email);

      // Update stored user data
      const storedUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (storedUser) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            name: response.data.user.name,
            email: response.data.user.email,
          })
        );
      }

      setIsEditing(false);

      alert("Profile Updated Successfully!");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="profile-container">

      <h1 className="profile-title">
        👤 My Profile
      </h1>

      <div className="profile-card">

        {/* Avatar */}
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>

        {/* Name */}
        <div className="profile-row">

          <span>Name</span>

          {isEditing ? (
            <input
              type="text"
              className="profile-input"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
            />
          ) : (
            <strong>{user.name}</strong>
          )}

        </div>

        {/* Email */}
        <div className="profile-row">

          <span>Email</span>

          {isEditing ? (
            <input
              type="email"
              className="profile-input"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
            />
          ) : (
            <strong>{user.email}</strong>
          )}

        </div>

        {/* Budget */}
        <div className="profile-row">

          <span>Monthly Budget</span>

          <strong>
            ₹
            {Number(
              user.monthlyBudget
            ).toLocaleString("en-IN")}
          </strong>

        </div>

        {/* Buttons */}
        {!isEditing ? (
          <button
            className="profile-btn"
            onClick={handleEdit}
          >
            ✏️ Edit Profile
          </button>
        ) : (
          <div className="profile-edit-actions">

            <button
              className="profile-btn"
              onClick={handleSave}
            >
              ✅ Save Changes
            </button>

            <button
              className="profile-cancel-btn"
              onClick={handleCancel}
            >
              ❌ Cancel
            </button>

          </div>
        )}

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default Profile;