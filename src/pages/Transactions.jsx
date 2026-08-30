import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/Transactions.css";

function Transactions() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await API.get("/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);

      alert("Expense Deleted Successfully!");

      fetchExpenses();
    } catch (error) {
      console.error(error);
      alert("Failed to delete expense!");
    }
  };

  /* =========================
     CATEGORY ICON
  ========================= */

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

      default:
        return "📦";
    }
  };

  /* =========================
     SEARCH FILTER
  ========================= */

  const filteredExpenses = expenses.filter((expense) => {
    const category = expense.category?.toLowerCase() || "";
    const description = expense.description?.toLowerCase() || "";
    const searchText = search.toLowerCase();

    return (
      category.includes(searchText) ||
      description.includes(searchText)
    );
  });

  return (
    <div className="transactions-container">

      {/* =========================
          TITLE
      ========================= */}

      <h1 className="transactions-title">
        Transaction History
      </h1>

      {/* =========================
          SEARCH
      ========================= */}

      <input
        type="text"
        className="search-box"
        placeholder="🔍 Search by category or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* =========================
          TRANSACTIONS
      ========================= */}

      {filteredExpenses.length === 0 ? (

        <div className="no-transactions">
          <div className="empty-icon">
            💸
          </div>

          <h2>No Expenses Found</h2>

          <p>
            {search
              ? "No expenses match your search."
              : "You haven't added any expenses yet."}
          </p>
        </div>

      ) : (

        <div className="transactions-list">

          {filteredExpenses.map((expense) => (

            <div
              className="transaction-card"
              key={expense._id}
            >

              {/* =========================
                  TOP SECTION
              ========================= */}

              <div className="transaction-top">

                <div className="transaction-icon">
                  {getCategoryIcon(expense.category)}
                </div>

                <div className="transaction-category">

                  <h3>
                    {expense.category}
                  </h3>

                  <span>
                    Expense
                  </span>

                </div>

              </div>

              {/* =========================
                  AMOUNT
              ========================= */}

              <div className="transaction-amount">
                ₹{Number(expense.amount).toLocaleString("en-IN")}
              </div>

              {/* =========================
                  DETAILS
              ========================= */}

              <div className="transaction-details">

                <p>
                  <strong>Description:</strong>{" "}
                  {expense.description}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(
                    expense.date
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

              </div>

              {/* =========================
                  ACTION BUTTONS
              ========================= */}

              <div className="transaction-actions">

                <button
                  className="edit-btn"
                  onClick={() =>
                    navigate("/add-expense", {
                      state: { expense },
                    })
                  }
                >
                  ✏️ Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(expense._id)
                  }
                >
                  🗑️ Delete
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

      {/* =========================
          BACK BUTTON
      ========================= */}

      <button
        className="back-btn"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

    </div>
  );
}

export default Transactions;