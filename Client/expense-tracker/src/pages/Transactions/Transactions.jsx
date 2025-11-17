import { useEffect, useState } from "react";
import axios from "axios";
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
    user : user,
  });


  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/getTransactionsByUserId",
        { params : { userId } }
      );
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/deleteTransaction/${id}`);
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  const handleAdd = () => {
    setEditData(null);
    setFormData({
      type: "",
      category: "",
      amount: "",
      date: "",
      note: "",
      user: user,
    });
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
        const res = await axios.put(
          `http://localhost:8080/editTransaction/${editData.id}`,
          { ...data, user: { id: userId } }
        );
        setTransactions(
          transactions.map((t) => (t.id === editData.id ? res.data : t))
        );
      } else {
        const res = await axios.post(
          `http://localhost:8080/addTransaction`,
          data
        );
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
        <h1>Transactions</h1>
        <button className="add-btn" onClick={handleAdd}>
         Add Transaction
        </button>
      </div>

      <div className="table-wrapper">
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Note</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.date}</td>
                  <td>{tx.type}</td>
                  <td>{tx.category}</td>
                  <td>₹{tx.amount}</td>
                  <td>{tx.note}</td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(tx)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(tx.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editData ? "Edit Transaction" : "Add Transaction"}</h2>
            <form
              className="modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave(formData);
              }}
            >
              <label>
                Type:
                <select
                  name="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  required
                >
                  <option value="">Select</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </label>

              <label>
                Category:
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                />
              </label>

              <label>
                Amount:
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
              </label>

              <label>
                Date:
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </label>

              <label>
                Note:
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  rows="3"
                />
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
