import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import API from "../api/api";
import "../styles/Analytics.css";

function Analytics() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(15000);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch expenses
      const expenseResponse = await API.get("/expenses");
      setExpenses(expenseResponse.data);

      // Fetch user budget
      const profileResponse = await API.get("/auth/profile");
      setMonthlyBudget(profileResponse.data.monthlyBudget);
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     TOTAL EXPENSES
  ========================= */

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  /* =========================
     TOTAL SAVINGS
  ========================= */

  const totalSavings = monthlyBudget - totalExpenses;

  /* =========================
     BUDGET PERCENTAGE
  ========================= */

  const spendingPercentage =
    monthlyBudget > 0
      ? Math.min((totalExpenses / monthlyBudget) * 100, 100)
      : 0;

  /* =========================
     CATEGORY DATA
  ========================= */

  const categoryData = [];

  expenses.forEach((expense) => {
    const existing = categoryData.find(
      (item) => item.name === expense.category
    );

    if (existing) {
      existing.value += Number(expense.amount);
    } else {
      categoryData.push({
        name: expense.category,
        value: Number(expense.amount),
      });
    }
  });

  /* =========================
     MONTHLY DATA
  ========================= */

  const monthlyData = [];

  expenses.forEach((expense) => {
    const month = new Date(expense.date).toLocaleString("default", {
      month: "short",
    });

    const existing = monthlyData.find(
      (item) => item.month === month
    );

    if (existing) {
      existing.amount += Number(expense.amount);
    } else {
      monthlyData.push({
        month,
        amount: Number(expense.amount),
      });
    }
  });

  /* =========================
     TOP CATEGORY
  ========================= */

  const topCategory =
    categoryData.length > 0
      ? categoryData.reduce((a, b) =>
          a.value > b.value ? a : b
        )
      : null;

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
     COLORS
  ========================= */

  const COLORS = [
    "#2563EB",
    "#38BDF8",
    "#172554",
    "#16A34A",
    "#F59E0B",
    "#DC2626",
  ];

  /* =========================
     SMART RECOMMENDATION
  ========================= */

  let recommendation = "";

  if (expenses.length === 0) {
    recommendation =
      "Start adding expenses to receive personalized spending insights.";
  } else if (totalExpenses > monthlyBudget) {
    recommendation =
      "Your spending has exceeded your monthly budget. Consider reducing non-essential expenses.";
  } else if (spendingPercentage >= 80) {
    recommendation =
      "You have used most of your monthly budget. Try to control your spending for the rest of the month.";
  } else if (topCategory && totalExpenses > 0) {
    const topPercentage =
      (topCategory.value / totalExpenses) * 100;

    if (topPercentage >= 40) {
      recommendation =
        `A large portion of your spending goes to ${topCategory.name}. Consider reducing this category to increase your savings.`;
    } else {
      recommendation =
        "Your spending is distributed across multiple categories. Keep tracking your expenses to maintain good financial habits.";
    }
  } else {
    recommendation =
      "Keep tracking your expenses regularly to understand your spending patterns.";
  }

  return (
    <div className="analytics-container">

      {/* =========================
          TITLE
      ========================= */}

      <h1 className="analytics-title">
        Expense Analytics
      </h1>

      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <div className="summary-cards">

        <div className="card">
          <div className="summary-icon">
            💸
          </div>

          <h3>Total Expenses</h3>

          <p>
            ₹{totalExpenses.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="card">
          <div className="summary-icon">
            💰
          </div>

          <h3>Total Savings</h3>

          <p
            className={
              totalSavings < 0
                ? "negative-value"
                : "positive-value"
            }
          >
            ₹{totalSavings.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="card">
          <div className="summary-icon">
            🏆
          </div>

          <h3>Top Category</h3>

          <p>
            {topCategory
              ? topCategory.name
              : "N/A"}
          </p>
        </div>

      </div>

      {/* =========================
          CHARTS
      ========================= */}

      <div className="chart-section">

        <div className="chart-card">

          <h2>Expense Distribution</h2>

          {categoryData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <PieChart>

                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {categoryData.map(
                    (entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-chart-data">
              📊
              <p>
                No expense data available.
              </p>
            </div>
          )}

        </div>

        <div className="chart-card">

          <h2>Monthly Trend</h2>

          {monthlyData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart data={monthlyData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="amount"
                  fill="#2563EB"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-chart-data">
              📈
              <p>
                No monthly data available.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* =========================
          INSIGHTS
      ========================= */}

      <div className="insights-title">
        <h2>💡 Smart Insights</h2>

        <p>
          Understand your spending and make better
          financial decisions.
        </p>
      </div>

      <div className="insights-grid">

        {/* Top Category */}
        <div className="insight-box">

          <div className="insight-icon">
            {topCategory
              ? getCategoryIcon(
                  topCategory.name
                )
              : "🏆"}
          </div>

          <div className="insight-content">

            <h3>
              Top Spending Category
            </h3>

            {topCategory ? (
              <>
                <h4>
                  {topCategory.name}
                </h4>

                <p>
                  You spent{" "}
                  <strong>
                    ₹
                    {topCategory.value.toLocaleString(
                      "en-IN"
                    )}
                  </strong>{" "}
                  on{" "}
                  {topCategory.name}.
                </p>

                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${
                        totalExpenses > 0
                          ? (topCategory.value /
                              totalExpenses) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>

                <span className="percentage-text">
                  {totalExpenses > 0
                    ? Math.round(
                        (topCategory.value /
                          totalExpenses) *
                          100
                      )
                    : 0}
                  % of total spending
                </span>
              </>
            ) : (
              <p>
                No expense data available.
              </p>
            )}

          </div>

        </div>

        {/* Budget Status */}
        <div className="insight-box">

          <div className="insight-icon">
            💰
          </div>

          <div className="insight-content">

            <h3>
              Budget Status
            </h3>

            <h4>
              ₹
              {Math.abs(
                totalSavings
              ).toLocaleString("en-IN")}
              {totalSavings >= 0
                ? " remaining"
                : " over budget"}
            </h4>

            <p>
              You have used{" "}
              <strong>
                {Math.round(
                  spendingPercentage
                )}
                %
              </strong>{" "}
              of your monthly budget.
            </p>

            <div className="progress-container">
              <div
                className={`progress-bar ${
                  spendingPercentage >= 100
                    ? "progress-danger"
                    : spendingPercentage >= 80
                    ? "progress-warning"
                    : ""
                }`}
                style={{
                  width: `${spendingPercentage}%`,
                }}
              ></div>
            </div>

            <span className="percentage-text">
              Budget: ₹
              {monthlyBudget.toLocaleString(
                "en-IN"
              )}
            </span>

          </div>

        </div>

        {/* Recommendation */}
        <div className="insight-box">

          <div className="insight-icon">
            💡
          </div>

          <div className="insight-content">

            <h3>
              Smart Recommendation
            </h3>

            <p className="recommendation-text">
              {recommendation}
            </p>

          </div>

        </div>

      </div>

      {/* =========================
          BACK BUTTON
      ========================= */}

      <button
        className="back-btn"
        onClick={() =>
          navigate("/dashboard")
        }
      >
        ← Back to Dashboard
      </button>

    </div>
  );
}

export default Analytics;