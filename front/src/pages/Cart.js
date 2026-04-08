// src/pages/Cart.js
import React, { useEffect, useState, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { UserContext } from "../context/UserContext";
import { getOrCreateCart, updateCartQuantity, removeFromCart } from "../api/cartapi";

export default function Cart() {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchCart = async () => {
      try {
        const data = await getOrCreateCart(user.id);
        setCart(data);
      } catch (err) {
        console.error("❌ Failed to load cart:", err);
      }
    };

    fetchCart();
  }, [user]);

  const handleQuantityChange = async (index, qty) => {
    if (!cart) return;
    if (qty < 1) return;

    try {
      const productId = cart.products[index].id;
      await updateCartQuantity(cart.id, productId, qty);

      const updatedCart = { ...cart };
      updatedCart.quantities[index] = qty;
      setCart(updatedCart);
    } catch (err) {
      console.error("❌ Failed to update quantity:", err);
      alert("Failed to update quantity.");
    }
  };

  const handleRemoveProduct = async (index) => {
    if (!cart) return;

    try {
      const productId = cart.products[index].id;
      await removeFromCart(cart.id, productId);

      const updatedCart = { ...cart };
      updatedCart.products.splice(index, 1);
      updatedCart.quantities.splice(index, 1);
      setCart(updatedCart);
    } catch (err) {
      console.error("❌ Failed to remove product:", err);
      alert("Failed to remove product.");
    }
  };

  const subtotal = cart?.products.reduce(
    (acc, product, i) => acc + product.price * cart.quantities[i],
    0
  ) || 0;

  return (
    <>
      <Header />
      <div style={{ padding: "20px", minHeight: "80vh" }}>
        <h2>Your Cart</h2>

        {!cart ? (
          <p>Loading cart...</p>
        ) : cart.products.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cart.products.map((product, i) => (
              <div
                key={product.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ width: "80px", marginRight: "10px" }}
                  />
                  <div>
                    <p style={{ margin: 0 }}>{product.name}</p>
                    <p style={{ margin: 0 }}>${product.price}</p>
                  </div>
                </div>

                <div>
                  <input
                    type="number"
                    value={cart.quantities[i]}
                    min="1"
                    onChange={(e) =>
                      handleQuantityChange(i, parseInt(e.target.value))
                    }
                    style={{ width: "60px", marginRight: "10px" }}
                  />
                  <button onClick={() => handleRemoveProduct(i)}>Remove</button>
                </div>
              </div>
            ))}

            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <p>Subtotal: ${subtotal.toFixed(2)}</p>
              <p>Shipping: ${cart.shipping?.toFixed(2) || 10}</p>
              <p>
                <strong>
                  Total: ${(subtotal + (cart.shipping || 10)).toFixed(2)}
                </strong>
              </p>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
