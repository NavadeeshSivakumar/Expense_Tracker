import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./Transactions.css";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

  const [formData, setFormData] = useState({
    type: "",
    category: "",
    amount: "",
    date: "",
    note: "",
    user: user,
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/getTransactionsByUserId", { params: { userId } });
      setTransactions(res.data);
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
      console.error("Error deleting transaction:", err);
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
      console.error("Error saving transaction:", err);
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
        <button className="add-btn" onClick={handleAdd}>
          <i className="ti ti-plus" aria-hidden="true"></i> Add transaction
        </button>
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
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="td-date">{tx.date}</td>
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
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editData ? "Edit transaction" : "Add transaction"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="ti ti-x" aria-hidden="true"></i>
              </button>
            </div>

            <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
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