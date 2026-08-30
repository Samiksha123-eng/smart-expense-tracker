import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import "../styles/AddExpense.css";

function AddExpense() {
  const navigate = useNavigate();
  const location = useLocation();

  const expense = location.state?.expense;

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  // Load existing expense when editing
  useEffect(() => {
    if (expense) {
      setAmount(expense.amount);
      setDescription(expense.description);
      setDate(expense.date.split("T")[0]);

      const standardCategories = [
        "Food",
        "Travel",
        "Shopping",
        "Bills",
        "Entertainment",
        "Education",
        "Others",
      ];

      if (standardCategories.includes(expense.category)) {
        setCategory(expense.category);
        setCustomCategory("");
      } else {
        setCategory("Others");
        setCustomCategory(expense.category);
      }
    }
  }, [expense]);

  const handleSubmit = async () => {
    try {
      // Amount validation
      if (!amount || Number(amount) <= 0) {
        alert("Please enter a valid expense amount!");
        return;
      }

      // Description validation
      if (!description.trim()) {
        alert("Please enter a description!");
        return;
      }

      // Date validation
      if (!date) {
        alert("Please select a date!");
        return;
      }

      // Custom category validation
      if (category === "Others" && !customCategory.trim()) {
        alert("Please enter your custom category!");
        return;
      }

      // Final category
      const finalCategory =
        category === "Others"
          ? customCategory.trim()
          : category;

      const expenseData = {
        amount: Number(amount),
        category: finalCategory,
        description: description.trim(),
        date,
      };

      // Update existing expense
      if (expense) {
        await API.put(
          `/expenses/${expense._id}`,
          expenseData
        );

        alert("Expense Updated Successfully!");
      } else {
        // Add new expense
        await API.post("/expenses", expenseData);

        alert("Expense Added Successfully!");
      }

      navigate("/transactions");

    } catch (error) {
      console.error(error);

      // Monthly budget exceeded
      if (
        error.response?.status === 400 &&
        error.response?.data?.message ===
          "Monthly budget exceeded"
      ) {
        const data = error.response.data;

        alert(
          `⚠️ Monthly Budget Exceeded!\n\n` +
          `Monthly Budget: ₹${data.budget}\n` +
          `Already Spent: ₹${data.spent}\n` +
          `Remaining Budget: ₹${data.remaining}\n` +
          `Expense Amount: ₹${data.attempted}`
        );

        return;
      }

      // Other errors
      alert(
        error.response?.data?.message ||
          "Failed to save expense!"
      );
    }
  };

  return (
    <div className="expense-container">

      <h1 className="expense-title">
        {expense ? "Edit Expense" : "Add New Expense"}
      </h1>

      {/* Amount */}
      <label>Amount</label>

      <input
        type="number"
        className="expense-input"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* Category */}
      <label>Category</label>

      <select
        className="expense-input category-select"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);

          if (e.target.value !== "Others") {
            setCustomCategory("");
          }
        }}
      >
        <option value="Food">🍔 Food</option>
        <option value="Travel">✈️ Travel</option>
        <option value="Shopping">🛍️ Shopping</option>
        <option value="Bills">💡 Bills</option>
        <option value="Entertainment">
          🎬 Entertainment
        </option>
        <option value="Education">📚 Education</option>
        <option value="Others">📦 Others</option>
      </select>

      {/* Custom Category */}
      {category === "Others" && (
        <div className="custom-category-wrapper">
          <label>Custom Category</label>

          <input
            type="text"
            className="expense-input custom-category"
            placeholder="Enter your category"
            value={customCategory}
            onChange={(e) =>
              setCustomCategory(e.target.value)
            }
          />
        </div>
      )}

      {/* Description */}
      <label>Description</label>

      <input
        type="text"
        className="expense-input"
        placeholder="Enter Description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      {/* Date */}
      <label>Date</label>

      <div className="date-input-wrapper">
        <input
          type="date"
          className="expense-input"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
        />

        <span className="calendar-icon">
          📅
        </span>
      </div>

      {/* Save / Update */}
      <button
        className="expense-button"
        onClick={handleSubmit}
      >
        {expense
          ? "Update Expense"
          : "Save Expense"}
      </button>

      {/* Back */}
      <button
        className="back-btn"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>

    </div>
  );
}

export default AddExpense;