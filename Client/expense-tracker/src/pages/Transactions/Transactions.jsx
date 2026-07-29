import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./Transactions.css";
import axios from "axios";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const itemsPerPage = 10;
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterType, filterMonth])

  const [formData, setFormData] = useState({
    type: "",
    category: "",
    amount: "",
    date: "",
    note: "",
    user: user,
  });

  const handleStatementUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `http://localhost:8000/parse-statement/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const parsed = res.data.transactions;

      // Save each transaction to Java backend
      for (const tx of parsed) {
        await axiosInstance.post("/addTransaction", {
          type: tx.type,
          category: tx.category,
          amount: tx.amount,
          date: tx.date,
          note: tx.note,
          user: { id: userId }
        });
      }

      await fetchTransactions();
      alert(`Successfully imported ${parsed.length} transactions!`);
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to parse statement";
      alert(message);
    } finally {
      setUploading(false);
      fileInputRef.current.value = "";
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.category.toLowerCase().includes(search.toLowerCase()) ||
      (tx.note && tx.note.toLowerCase().includes(search.toLowerCase()));

    const matchesType = filterType ? tx.type === filterType : true;

    const matchesMonth = filterMonth
      ? tx.date.startsWith(filterMonth)
      : true;

    return matchesSearch && matchesType && matchesMonth;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/getTransactionsByUserId", { params: { userId } });
      setTransactions(res.data.reverse());
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/deleteTransaction/${id}`);
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (err) {
      // Add this
      const message = err.response?.data?.message || "Failed to delete transaction";
      alert(message);
    }
  };

  const handleAdd = () => {
    setEditData(null);
    setFormData({ type: "", category: "", amount: "", date: "", note: "", user });
    setShowModal(true);
  };

  const handleEdit = (transaction) => {
    setEditData(transaction);
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date,
      note: transaction.note,
    });
    setShowModal(true);
  };

  const handleSave = async (data) => {
    try {
      if (editData) {
        const res = await axiosInstance.put(`/editTransaction/${editData.id}`, {
          ...data,
          user: { id: userId },
        });
        setTransactions(transactions.map((t) => (t.id === editData.id ? res.data : t)));
      } else {
        const res = await axiosInstance.post("/addTransaction", data);
        setTransactions([...transactions, res.data]);
      }
      setShowModal(false);
    } catch (err) {
        const message = err.response?.data?.message || "Something went wrong";
        alert(message);
      }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <div>
          <h1 className="transactions-title">Transactions</h1>
          <span className="transactions-subtitle">Your income and expenses</span>
        </div>
        <div className="header-actions">
          {user?.plan === "PRO" && (
            <>
              <input
                type="file"
                accept=".pdf, .xlsx, .xls"
                ref={fileInputRef}
                onChange={handleStatementUpload}
                style={{ display: "none" }}
              />
              <button
                className="upload-btn"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
              >
                <i className="ti ti-upload" aria-hidden="true"></i>
                {uploading ? "Importing..." : "Import statement"}
              </button>
            </>
          )}
          <button className="add-btn" onClick={handleAdd}>
            <i className="ti ti-plus" aria-hidden="true"></i> Add transaction
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-wrapper">
          <i className="ti ti-search" aria-hidden="true"></i>
          <input
            type="text"
            placeholder="Search by category or note..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <button
            className={`filter-btn ${filterType === "" ? "active" : ""}`}
            onClick={() => setFilterType("")}
          >
            All
          </button>
          <button
            className={`filter-btn ${filterType === "Income" ? "active income" : ""}`}
            onClick={() => setFilterType("Income")}
          >
            Income
          </button>
          <button
            className={`filter-btn ${filterType === "Expense" ? "active expense" : ""}`}
            onClick={() => setFilterType("Expense")}
          >
            Expense
          </button>
        </div>

        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        >
          <option value="">All months</option>
          <option value="2026-01">January</option>
          <option value="2026-02">February</option>
          <option value="2026-03">March</option>
          <option value="2026-04">April</option>
          <option value="2026-05">May</option>
          <option value="2026-06">June</option>
          <option value="2026-07">July</option>
          <option value="2026-08">August</option>
          <option value="2026-09">September</option>
          <option value="2026-10">October</option>
          <option value="2026-11">November</option>
          <option value="2026-12">December</option>
        </select>

        {(search || filterType || filterMonth) && (
          <button
            className="clear-filters-btn"
            onClick={() => {
              setSearch("");
              setFilterType("");
              setFilterMonth("");
            }}
          >
            <i className="ti ti-x" aria-hidden="true"></i> Clear
          </button>
        )}
      </div>

      <div className="transactions-table-wrapper">
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <i className="ti ti-receipt-off" aria-hidden="true"></i>
            <p>No transactions yet</p>
            <span>Add your first transaction to get started</span>
          </div>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Note</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontSize: "13px" }}>
                    No transactions found
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="td-date">
                      {new Date(tx.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="td-category">{tx.category}</td>
                    <td className="td-note">{tx.note || "—"}</td>
                    <td>
                      <span className={`type-badge ${tx.type.toLowerCase()}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`td-amount ${tx.type.toLowerCase()}`}>
                      {tx.type === "Income" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="td-actions">
                      <button className="action-btn edit" onClick={() => handleEdit(tx)}>
                        <i className="ti ti-edit" aria-hidden="true"></i>
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(tx.id)}>
                        <i className="ti ti-trash" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            <i className="ti ti-chevron-left" aria-hidden="true"></i>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`page-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="page-btn"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="ti ti-chevron-right" aria-hidden="true"></i>
          </button>

          <span className="page-info">
            {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}
          </span>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editData ? "Edit transaction" : "Add transaction"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="ti ti-x" aria-hidden="true"></i>
              </button>
            </div>

            <form
              className="modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave(formData);
              }}
            >
              <div className="form-group">
                <label>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="">Select type</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Health">Health</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Rent">Rent</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Note <span className="optional">(optional)</span></label>
                <input
                  type="text"
                  placeholder="Add a note..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editData ? "Save changes" : "Add transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}