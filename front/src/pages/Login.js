import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Login.css";
import { UserContext } from "../context/UserContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
   e.preventDefault();
   setLoading(true);
   setMessage("");

   try {
     const res = await axios.post(
       "http://localhost:8080/api/user/login",
       form
     );

     // ⚡ الآن نحفظ بيانات كاملة للمستخدم
     const userData = {
       id: res.data.id,
       username: res.data.username,
       email: res.data.email,
       role: res.data.role,
     };

     // حفظ في localStorage + تحديث UserContext
     localStorage.setItem("user", JSON.stringify(userData));
     setUser(userData);

     navigate("/"); // تحويل للصفحة الرئيسية
   } catch (err) {
     setMessage(err.response?.data || "❌ Login failed");
   } finally {
     setLoading(false);
   }
 };


  return (
    <>
      <Header />
      <main className="login-page">
        <div className="login-card-wrapper container d-flex justify-content-center align-items-center">
          <div className="login-card shadow-lg">
            <h2 className="login-title">🔐 Welcome Back</h2>
            <form onSubmit={handleSubmit} className="login-form">
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
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
            {message && <p className="login-message">{message}</p>}
            <div className="text-center mt-3 small">
              <Link to="/forgot" className="auth-link me-3">
                Forgot password?
              </Link>
              <Link to="/registre" className="auth-link">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
