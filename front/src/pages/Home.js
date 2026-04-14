import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/home.css";
import { UserContext } from "../context/UserContext";

const Home = () => {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);

  // Load products
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("❌ Error loading products:", err);
      setProducts([]);
    }
  };

  // 🛒 Add to cart (CART MICROSERVICE)
  const handleAddToCart = async (product) => {
    if (!user?.id) {
      alert("User ID not found. Cannot add to cart.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/cart/add", {
        userId: user.id,
        productId: product.id,
        quantity: 1,
      });

      console.log("Cart updated:", res.data);

      alert(`${product.name} added to cart!`);
    } catch (err) {
      console.error("❌ Add to cart failed:", err);
      alert("Failed to add product to cart.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Nassim Store | Premium Products & Fast Delivery</title>
        <meta
          name="description"
          content="Discover unique products at Nassim Store. Enjoy fast delivery, easy checkout, and exclusive deals. Shop online now!"
        />
      </Helmet>

      <Header />

      <main role="main">
        <section className="featured-modern py-5">
          <div className="container">
            <h2 className="text-center mb-4">Trending Now</h2>

            <div className="scrollable-row d-flex flex-nowrap overflow-auto pb-3">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="modern-card me-4 flex-shrink-0"
                  >
                    <div className="modern-img">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name || "Product"}
                          style={{
                            maxHeight: "180px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>

                    <div className="modern-content text-center">
                      <h3>{product.name}</h3>
                      <p className="price">${product.price || "0.00"}</p>

                      {user ? (
                        <button
                          className="btn btn-outline-success btn-sm mt-2"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <Link
                          to="/login"
                          className="btn btn-outline-warning btn-sm mt-2"
                        >
                          Login to Add
                        </Link>
                      )}

                      <Link
                        to={`/product/${product.id}`}
                        className="btn btn-outline-light btn-sm mt-2"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products available.</p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;