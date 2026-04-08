import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import "../styles/admin.css";

export default function AdminPanel() {
  // ------------------------------- Products State -------------------------------
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [productImage, setProductImage] = useState(null);
  const [productEditId, setProductEditId] = useState(null);

  // ------------------------------- Users State -------------------------------
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [userEditEmail, setUserEditEmail] = useState(null);

  // ------------------------------- Chat State -------------------------------
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState("all"); // broadcast by default
  const clientRef = useRef(null);
  const chatContainerRef = useRef(null);
  const adminId = "admin";

  // ------------------------------- Fetch Products & Users -------------------------------
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch products", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/user/all");
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  // ------------------------------- Product Handlers -------------------------------
  const handleProductChange = (e) =>
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  const handleProductImageChange = (e) => setProductImage(e.target.files[0]);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", productForm.name);
      data.append("description", productForm.description);
      data.append("price", productForm.price);
      data.append("category", productForm.category);
      if (productImage) data.append("image", productImage);

      let res;
      if (productEditId) {
        res = await axios.put(
          `http://localhost:8080/api/products/${productEditId}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setProducts(products.map((p) => (p.id === productEditId ? res.data : p)));
        setProductEditId(null);
        alert("✅ Product updated!");
      } else {
        res = await axios.post(
          "http://localhost:8080/api/products",
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setProducts([res.data, ...products]);
        alert("✅ Product added!");
      }

      setProductForm({ name: "", description: "", price: "", category: "" });
      setProductImage(null);
    } catch (err) {
      console.error("❌ Error adding/updating product:", err);
    }
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      alert("✅ Product deleted!");
    } catch (err) {
      console.error("❌ Failed to delete product:", err);
    }
  };

  const handleProductEdit = (product) => {
    setProductEditId(product.id);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
    });
    setProductImage(null);
  };

  // ------------------------------- User Handlers -------------------------------
  const handleUserChange = (e) =>
    setUserForm({ ...userForm, [e.target.name]: e.target.value });

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (userEditEmail) {
        res = await axios.put(`http://localhost:8080/api/user/${userEditEmail}`, userForm);
        setUsers(users.map((u) => (u.email === userEditEmail ? res.data : u)));
        setUserEditEmail(null);
        alert("✅ User updated!");
      } else {
        res = await axios.post("http://localhost:8080/api/user/register", userForm);
        fetchUsers();
        alert("✅ User added!");
      }
      setUserForm({ name: "", email: "", password: "", role: "user" });
    } catch (err) {
      console.error("❌ Error adding/updating user:", err);
    }
  };

  const handleUserDelete = async (email) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/user/${email}`);
      setUsers(users.filter((u) => u.email !== email));
      alert("✅ User deleted!");
    } catch (err) {
      console.error("❌ Failed to delete user:", err);
    }
  };

  const handleUserEdit = (user) => {
    setUserEditEmail(user.email);
    setUserForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
  };

  // ------------------------------- Chat Handlers -------------------------------
  const scrollToBottom = () => {
    const panel = chatContainerRef.current;
    if (panel) panel.scrollTop = panel.scrollHeight;
  };

  // Connect WebSocket for chat
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,
      debug: () => {},
      onConnect: () => {
        console.log("Admin connected via WebSocket");

        // Subscribe to broadcast
        client.subscribe("/topic/messages", (msg) => {
          const message = JSON.parse(msg.body);
          setMessages((prev) => [...prev, message]);
        });

        // Subscribe to admin private messages
        client.subscribe("/user/admin/queue/messages", (msg) => {
          const message = JSON.parse(msg.body);
          setMessages((prev) => [...prev, message]);
        });
      },
    });

    client.activate();
    clientRef.current = client;
    return () => client.deactivate();
  }, []);

  // Refetch messages whenever selected user changes
  useEffect(() => {
    const userParam = selectedUser === "all" ? "" : `?userId=${selectedUser}`;
    axios
      .get(`http://localhost:8080/api/chat/history${userParam}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Failed to fetch chat history:", err));
  }, [selectedUser]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const message = {
      senderId: adminId,
      senderName: "Admin",
      receiverId: selectedUser, // 'all' or specific user id/email
      content: input,
      timestamp: Date.now(),
    };

    clientRef.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(message),
    });

    setMessages((prev) => [...prev, message]);
    setInput("");
  };

  useEffect(() => scrollToBottom(), [messages]);

  // ------------------------------- Render -------------------------------
  return (
    <>
      <Header />
      <main className="contact-page">
        <div className="container py-5">
          <h1 className="contact-title text-center mb-4">Admin Panel</h1>

          {/* ---------------- Products ---------------- */}
          <section className="py-4 bg-light mb-5">
            <h2 className="text-center mb-3">{productEditId ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={handleProductSubmit} className="d-flex flex-column gap-2">
              <input type="text" name="name" placeholder="Product Name" value={productForm.name} onChange={handleProductChange} required />
              <input type="text" name="description" placeholder="Description" value={productForm.description} onChange={handleProductChange} required />
              <input type="number" name="price" placeholder="Price" value={productForm.price} onChange={handleProductChange} required />
              <input type="text" name="category" placeholder="Category" value={productForm.category} onChange={handleProductChange} required />
              <input type="file" onChange={handleProductImageChange} />
              <button type="submit" className="btn btn-success mt-2">{productEditId ? "Update Product" : "Add Product"}</button>
            </form>
          </section>

          {/* Products List */}
          <section className="py-4">
            <h2 className="text-center mb-3">Products List</h2>
            {products.length === 0 ? <p>No products yet</p> : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.imageUrl && <img src={product.imageUrl} alt={product.name} style={{ width: "50px", height: "50px", objectFit: "cover" }} />}</td>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>${product.price}</td>
                      <td>{product.category}</td>
                      <td>
                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleProductEdit(product)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleProductDelete(product.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* ---------------- Users ---------------- */}
          <section className="py-4 bg-light mb-5">
            <h2 className="text-center mb-3">{userEditEmail ? "Edit User" : "Add New User"}</h2>
            <form onSubmit={handleUserSubmit} className="d-flex flex-column gap-2">
              <input type="text" name="name" placeholder="Name" value={userForm.name} onChange={handleUserChange} required />
              <input type="email" name="email" placeholder="Email" value={userForm.email} onChange={handleUserChange} required disabled={!!userEditEmail} />
              <input type="password" name="password" placeholder="Password" value={userForm.password} onChange={handleUserChange} required={!userEditEmail} />
              <select name="role" value={userForm.role} onChange={handleUserChange} className="form-select">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" className="btn btn-success mt-2">{userEditEmail ? "Update User" : "Add User"}</button>
            </form>
          </section>

          {/* Users List */}
          <section className="py-4">
            <h2 className="text-center mb-3">Users List</h2>
            {users.length === 0 ? <p>No users yet</p> : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.email}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleUserEdit(user)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleUserDelete(user.email)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* ---------------- Chat ---------------- */}
          <section className="py-4 bg-light">
            <h2 className="text-center mb-3">Admin Chat</h2>

            {/* User selection */}
            <div className="chat-users mb-3">
              <strong>Chat with:</strong>{" "}
              <button
                className={`btn btn-sm ${selectedUser === "all" ? "btn-primary" : "btn-outline-primary"} me-2`}
                onClick={() => setSelectedUser("all")}
              >
                All
              </button>
              {users.map((u) => (
                <button
                  key={u.id}
                  className={`btn btn-sm ${selectedUser === u.id ? "btn-primary" : "btn-outline-primary"} me-2`}
                  onClick={() => setSelectedUser(u.id)}
                >
                  {u.name}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              style={{
                minHeight: "350px",
                maxHeight: "500px",
                overflowY: "auto",
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "10px",
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {messages
                .filter((msg) => {
                  if (selectedUser === "all") return msg.receiverId === "all" || msg.senderId === "admin";
                  return (
                    (msg.senderId === "admin" && msg.receiverId === selectedUser) ||
                    (msg.senderId === selectedUser && msg.receiverId === "admin")
                  );
                })
                .map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "6px 10px",
                      marginBottom: "6px",
                      borderRadius: "5px",
                      maxWidth: "70%",
                      alignSelf: msg.senderId === "admin" ? "flex-end" : "flex-start",
                      backgroundColor: msg.senderId === "admin" ? "#4f93ff" : "#e0e0e0",
                      color: msg.senderId === "admin" ? "#fff" : "#000",
                      wordBreak: "break-word",
                    }}
                  >
                    <b>{msg.senderName || msg.senderId}:</b> {msg.content}
                  </div>
                ))}
            </div>

            {/* Input */}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                style={{ flex: 1, padding: "8px" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button onClick={sendMessage} style={{ padding: "8px 18px" }}>Send</button>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}