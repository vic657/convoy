import React, { useState, useEffect } from "react";
import "../assets/css/users.css";
import { FaSearch, FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import CountryList from "country-list-with-dial-code-and-flag";
import { apiAxios as axios } from "../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Users = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  const countries = CountryList.getAll();

  // ✅ Fetch users/staff
  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/users");
      let fetched = res.data?.users || res.data || [];

      if (activeTab === "users") {
        fetched = fetched.filter((u) => u.role === "user");
      } else {
        fetched = fetched.filter((u) => u.role !== "user");
      }

      setData(fetched);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Custom toast confirmation popup
  const confirmToast = (message, onConfirm) => {
    toast(
      ({ closeToast }) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ marginBottom: "10px" }}>{message}</p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              style={{
                background: "#d33",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
              onClick={() => {
                onConfirm();
                closeToast();
              }}
            >
              Yes
            </button>
            <button
              style={{
                background: "#3085d6",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
              onClick={closeToast}
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        theme: "dark",
      }
    );
  };

  // ✅ Confirmed delete
  const handleDeleteConfirmed = async (id) => {
    try {
      await axios.delete(`/users/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user.");
    }
  };

  // ✅ Delete single
  const handleDelete = (id) => {
    confirmToast("Are you sure you want to delete this user?", () => handleDeleteConfirmed(id));
  };

  // ✅ Bulk delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      toast.info("No users selected.");
      return;
    }
    confirmToast(`Delete ${selectedIds.length} selected user(s)?`, handleBulkDeleteConfirmed);
  };

  const handleBulkDeleteConfirmed = async () => {
    try {
      await axios.post("/users/bulk-delete", { ids: selectedIds });
      setData((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
      toast.success("Selected users deleted successfully!");
    } catch (err) {
      console.error("Error bulk deleting:", err);
      toast.error("Failed to delete selected users.");
    }
  };

  // ✅ Add / Edit
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.warn("Please fill all required fields.");
      return;
    }

    try {
      if (editItem) {
        await axios.put(`/users/${editItem.id}`, formData);
        toast.success("User updated successfully!");
      } else {
        await axios.post("/users", {
          ...formData,
          role: activeTab === "staff" ? formData.role : "user",
        });
        toast.success("User registered successfully!");
      }

      setShowForm(false);
      setEditItem(null);
      fetchUsers();
    } catch (err) {
      console.error("Error saving user:", err);
      if (err.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors)
          .flat()
          .join("\n");
        toast.error(messages);
      } else {
        toast.error(err.response?.data?.message || "Failed to save user.");
      }
    }
  };

  // ✅ Edit existing user (auto-filled form)
  const handleEdit = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name || "",
      email: item.email || "",
      nationality: item.nationality || "",
      phone: item.phone || "",
      passport_id: item.passport_id || "",
      role: item.role || "",
      password: "",
      confirmPassword: "",
    });
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      name: "",
      email: "",
      nationality: "",
      phone: "",
      passport_id: "",
      role: activeTab === "staff" ? "staff" : "user",
      password: "",
      confirmPassword: "",
    });
    setShowForm(true);
  };

  const handleNationalityChange = (e) => {
    const selected = countries.find((c) => c.name === e.target.value);
    setFormData({ ...formData, nationality: e.target.value });
    setCountryCode(selected ? selected.dial_code : "");
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isSelected = (id) => selectedIds.includes(id);
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = (checked) => {
    const visibleIds = paginatedData.map((d) => d.id);
    setSelectedIds((prev) => {
      if (checked) {
        const set = new Set([...prev, ...visibleIds]);
        return Array.from(set);
      } else {
        return prev.filter((id) => !visibleIds.includes(id));
      }
    });
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSelectedIds([]);
    setCurrentPage(1);
    setShowForm(false);
    setEditItem(null);
  };

  const allVisibleSelected =
    paginatedData.length > 0 &&
    paginatedData.every((d) => selectedIds.includes(d.id));

  return (
    <div className="users-container">
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar theme="colored" />

      <div className="users-card">
        {selectedIds.length > 0 && (
          <div className="bulk-bar">
            <div>{selectedIds.length} selected</div>
            <div className="bulk-actions">
              <button className="bulk-delete" onClick={handleBulkDelete}>
                Delete Selected
              </button>
            </div>
          </div>
        )}

        <div className="tab-header">
          <div className="tab-buttons">
            <button
              className={activeTab === "users" ? "active" : ""}
              onClick={() => switchTab("users")}
            >
              Users
            </button>
            <button
              className={activeTab === "staff" ? "active" : ""}
              onClick={() => switchTab("staff")}
            >
              Staff
            </button>
          </div>
          <button className="register-btn" onClick={handleAdd}>
            <FaPlus /> Register {activeTab === "users" ? "User" : "Staff"}
          </button>
        </div>

        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={(e) => handleSelectAllVisible(e.target.checked)}
                    />
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected(item.id)}
                          onChange={() => handleToggleSelect(item.id)}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.role}</td>
                      <td className="actions">
                        <span className="edit" onClick={() => handleEdit(item)}>
                          <FaEdit />
                        </span>
                        <span className="delete" onClick={() => handleDelete(item.id)}>
                          <FaTrash />
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">
                      No {activeTab} found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {showForm && (
          <div className="inline-form">
            <h3>{editItem ? "Edit" : "Register"} {activeTab === "users" ? "User" : "Staff"}</h3>
            <form onSubmit={handleSave}>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <select value={formData.nationality || ""} onChange={handleNationalityChange}>
                <option value="">Select Country</option>
                {countries.map((country, index) => (
                  <option key={`${country.name}-${index}`} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Passport / ID Number"
                value={formData.passport_id || ""}
                onChange={(e) => setFormData({ ...formData, passport_id: e.target.value })}
                required
              />

              <input
                type="text"
                placeholder={`Phone ${countryCode}`}
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password || ""}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="password-field">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {activeTab === "staff" && (
                <select
                  value={formData.role || ""}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                  
                  
                </select>
              )}


              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editItem ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditItem(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
