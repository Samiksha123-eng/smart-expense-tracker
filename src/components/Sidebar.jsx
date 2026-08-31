import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaPlusCircle,
  FaList,
  FaChartPie,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaChevronLeft,
} from "react-icons/fa";

import "../styles/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully!");

    navigate("/");
  };

  return (
    <aside
      className={`sidebar ${
        collapsed ? "sidebar-collapsed" : ""
      }`}
    >

      {/* =========================
          HEADER
      ========================= */}

      <div className="sidebar-header">

        <div className="logo">

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

          {!collapsed && (
            <span className="logo-text">
              Smart Expense Tracker
            </span>
          )}

        </div>

        {/* Collapse Button */}
        <button
          className="collapse-btn"
          onClick={() =>
            setCollapsed(!collapsed)
          }
          title={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          {collapsed ? (
            <FaBars />
          ) : (
            <FaChevronLeft />
          )}
        </button>

      </div>

      {/* =========================
          NAVIGATION
      ========================= */}

      <nav className="sidebar-nav">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "nav-link active"
              : "nav-link"
          }
        >
          <FaHome className="nav-icon" />

          {!collapsed && (
            <span>Dashboard</span>
          )}

          {collapsed && (
            <span className="tooltip">
              Dashboard
            </span>
          )}
        </NavLink>

        <NavLink
          to="/add-expense"
          className={({ isActive }) =>
            isActive
              ? "nav-link active"
              : "nav-link"
          }
        >
          <FaPlusCircle className="nav-icon" />

          {!collapsed && (
            <span>Add Expense</span>
          )}

          {collapsed && (
            <span className="tooltip">
              Add Expense
            </span>
          )}
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            isActive
              ? "nav-link active"
              : "nav-link"
          }
        >
          <FaList className="nav-icon" />

          {!collapsed && (
            <span>Transactions</span>
          )}

          {collapsed && (
            <span className="tooltip">
              Transactions
            </span>
          )}
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive
              ? "nav-link active"
              : "nav-link"
          }
        >
          <FaChartPie className="nav-icon" />

          {!collapsed && (
            <span>Analytics</span>
          )}

          {collapsed && (
            <span className="tooltip">
              Analytics
            </span>
          )}
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? "nav-link active"
              : "nav-link"
          }
        >
          <FaUser className="nav-icon" />

          {!collapsed && (
            <span>Profile</span>
          )}

          {collapsed && (
            <span className="tooltip">
              Profile
            </span>
          )}
        </NavLink>

      </nav>

      {/* =========================
          LOGOUT
      ========================= */}

      <div className="sidebar-bottom">

        <button
          className="logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          <FaSignOutAlt className="nav-icon" />

          {!collapsed && (
            <span>Logout</span>
          )}

          {collapsed && (
            <span className="tooltip">
              Logout
            </span>
          )}
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;