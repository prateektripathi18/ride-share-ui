import React, { useEffect, useState } from "react";
import { apiGet, apiPut } from "../../api/api";

export default function AdminProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await apiGet("/admin/profile");
      setForm({
        ...form,
        name: data.name,
        email: data.email,
        phone: data.phone
      });
    } catch (err) {
      console.error("Error loading profile", err);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await apiPut("/admin/profile/update", form);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error", err);
      alert("Error updating profile!");
    }
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>Admin Profile</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: "450px" }}>
        <label>Name</label>
        <input
          name="name"
          className="input"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Email (Read Only)</label>
        <input
          name="email"
          className="input"
          value={form.email}
          readOnly
        />

        <label>Phone</label>
        <input
          name="phone"
          className="input"
          value={form.phone}
          onChange={handleChange}
        />

        <label>New Password</label>
        <input
          type="password"
          name="password"
          className="input"
          onChange={handleChange}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          className="input"
          onChange={handleChange}
        />

        <button className="btn" type="submit">Save Changes</button>
      </form>
    </div>
  );
}
