import { Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
function App() {
  const location = useLocation();

  const hideSidebar =
    location.pathname === "/" || location.pathname === "/register";

  return (
    <div style={{ display: "flex" }}>
      {!hideSidebar && <Sidebar />}

      <div style={{ marginLeft: hideSidebar ? "0" : "220px", width: "100%" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/add-expense"
  element={
    <ProtectedRoute>
      <AddExpense />
    </ProtectedRoute>
  }
/>

<Route
  path="/transactions"
  element={
    <ProtectedRoute>
      <Transactions />
    </ProtectedRoute>
  }
/>

<Route
  path="/analytics"
  element={
    <ProtectedRoute>
      <Analytics />
    </ProtectedRoute>
  }
/>

<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>


<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>
        </Routes>
      </div>
    </div>
  );
}

export default App;