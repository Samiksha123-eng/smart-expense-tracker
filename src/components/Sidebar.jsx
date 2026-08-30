import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaPlusCircle,
  FaList,
  FaChartPie,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import "../styles/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  alert("Logged out successfully!");

  navigate("/");
};
  return (
    <div className="sidebar">

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

  <span>Smart Expense Tracker</span>
</div>

      <nav>

        <NavLink 
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <FaHome /> Dashboard
        </NavLink>

        <NavLink
  to="/add-expense"
  className={({ isActive }) =>
    isActive ? "nav-link active" : "nav-link"
  }
>
          <FaPlusCircle /> Add Expense
        </NavLink>

        <NavLink
  to="/transactions"
  className={({ isActive }) =>
    isActive ? "nav-link active" : "nav-link"
  }
>
          <FaList /> Transactions
        </NavLink>

        <NavLink
  to="/analytics"
  className={({ isActive }) =>
    isActive ? "nav-link active" : "nav-link"
  }
>
          <FaChartPie /> Analytics
        </NavLink>

        <NavLink
  to="/profile"
  className={({ isActive }) =>
    isActive ? "nav-link active" : "nav-link"
  }
>
          <FaUser /> Profile
        </NavLink>

        

        <NavLink
  to="/"
  className={({ isActive }) =>
    isActive ? "nav-link active" : "nav-link"
  }
>
          <FaSignOutAlt /> Logout
        </NavLink>

      </nav>

    </div>
  );
}

export default Sidebar;

