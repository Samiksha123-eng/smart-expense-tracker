import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(15000);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch Expenses
      const expenseResponse = await API.get("/expenses");
      setExpenses(expenseResponse.data);

      // Fetch User Profile
      const profileResponse = await API.get("/auth/profile");
      setMonthlyBudget(profileResponse.data.monthlyBudget);
    } catch (error) {
      console.error(error);
    }
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const remainingBudget = monthlyBudget - totalExpenses;

  const handleBudgetChange = async () => {
    const newBudget = prompt("Enter Monthly Budget:");

    if (!newBudget || isNaN(newBudget)) return;

    try {
      await API.put("/auth/budget", {
        monthlyBudget: Number(newBudget),
      });

      setMonthlyBudget(Number(newBudget));

      alert("Budget Updated Successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update budget");
    }
  };

  // Category icon function
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Food":
        return "🍔";
      case "Travel":
        return "✈️";
      case "Shopping":
        return "🛍️";
      case "Bills":
        return "💡";
      case "Entertainment":
        return "🎬";
      case "Education":
        return "📚";
      case "Others":
        return "📦";
      default:
        return "💰";
    }
  };

  return (
    <div className="dashboard-container">

      <h1 className="dashboard-title">
        Smart Expense Tracker
      </h1>

      <div className="summary-section">

        <div className="card">
          <h3>Total Expenses</h3>
          <p>₹{totalExpenses}</p>
        </div>

        <div className="card">
          <h3>Monthly Budget</h3>
          <p>₹{monthlyBudget}</p>

          <button
            className="budget-btn"
            onClick={handleBudgetChange}
          >
            Change Budget
          </button>
        </div>

        <div className="card">
          <h3>Remaining Budget</h3>

          <p
            className={
              remainingBudget < 0
                ? "budget-danger"
                : remainingBudget <= monthlyBudget * 0.2
                ? "budget-warning"
                : "budget-safe"
            }
          >
            ₹{remainingBudget}
          </p>
        </div>

      </div>

      <div className="transactions-section">

        <h2>Recent Transactions</h2>

        {expenses.length > 0 ? (
          expenses.slice(0, 3).map((expense) => (
            <div
              className="dashboard-expense"
              key={expense._id}
            >
              <div className="category-icon">
                {getCategoryIcon(expense.category)}
              </div>

              <div className="category-details">
                <span className="category-name">
                  {expense.category}
                </span>

                <span className="category-description">
                  {expense.description}
                </span>
              </div>

              <span className="expense-amount">
                ₹{expense.amount}
              </span>
            </div>
          ))
        ) : (
          <p>No Expenses Found</p>
        )}

      </div>

      <div className="button-section">

        <button onClick={() => navigate("/add-expense")}>
          Add Expense
        </button>

        <button onClick={() => navigate("/transactions")}>
          Transactions
        </button>

        <button onClick={() => navigate("/analytics")}>
          Analytics
        </button>

      </div>

    </div>
  );
}

export default Dashboard;