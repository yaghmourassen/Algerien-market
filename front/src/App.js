import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Regeist from "./pages/Regeist";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminPanel from "./pages/AdminPanel"; // nouveau nom
import Cart from "./pages/Cart"; // import the Cart page


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registre" element={<Regeist />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/cart" element={<Cart />} />  {/* <-- Add this */}
      </Routes>
    </>
  );
}

export default App;
