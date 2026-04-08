import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Regeist.css"; // custom CSS for Regeist

export default function Regeist() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Auto-fill email coming from Footer
  useEffect(() => {
    if (location.state?.email) {
      setForm((prev) => ({
        ...prev,
        email: location.state.email
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:8080/api/user/register", form);

      setMessage("✅ Registration successful! Redirecting to login...");
      setForm({
        username: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: ""
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
        "❌ Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="regeist-page">
        <div className="regeist-card-wrapper">
          <div className="regeist-card">
            <h2 className="regeist-title">📝 Create an Account</h2>

            <form onSubmit={handleSubmit} className="regeist-form">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={form.phoneNumber}
                onChange={handleChange}
              />

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="regeist-btn"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            {message && (
              <p
                className="regeist-message"
                style={{
                  color: message.includes("❌") ? "#d9534f" : "#28a745"
                }}
              >
                {message}
              </p>
            )}

            <div className="regeist-footer-text">
              Already have an account?{" "}
              <span
                className="regeist-login-link"
                onClick={() => navigate("/login")}
              >
                Login here
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
