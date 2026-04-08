import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category ? p.category === category : true)
  );

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <>
      <Header />

      {/* 🛒 Hero Section */}
      <section className="shop-hero">
        <h1>Welcome to Our Shop</h1>
        <p>Browse through our latest products and discover exclusive deals.</p>
      </section>

      {/* 🔍 Filter Bar (white background) */}
      <section className="filter-bar">
        <div className="container d-flex flex-wrap justify-content-center gap-3">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* 🧱 Products Section (white background) */}
      <section className="products-section">
        <div className="container">
          <h2>Our Products</h2>
          <p className="text-muted">
            Explore our collection and find what suits your needs best.
          </p>

          <div className="row g-4">
            {filtered.length > 0 ? (
              filtered.map((p) => (
                <div key={p.id} className="col-md-4 col-sm-6">
                  <div className="product-card">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} />
                    ) : (
                      <div className="p-5 text-center text-muted">No Image</div>
                    )}
                    <div className="product-info text-center">
                      <h5>{p.name}</h5>
                      <p>{p.category}</p>
                      <p className="price-tag">${p.price}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">No products found.</p>
            )}
          </div>
        </div>
      </section>

      {/* ✨ Call to Action (dark gradient) */}
      <section className="shop-cta">
        <div className="container text-center">
          <h2 className="mb-3">Join MyStore for exclusive benefits</h2>
          <p className="mb-4">
            Be the first to know about new arrivals, offers, and more.
          </p>
          <a href="/signup" className="btn-primary-glow">
            Join Now
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Shop;
