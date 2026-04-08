// src/api/cartapi.js
import axios from "axios";

const API = "http://localhost:8080/api/cart";

// ⚡ جلب الكارت للمستخدم أو إنشاءه إذا لم يكن موجود
export const getOrCreateCart = async (userId) => {
  try {
    const res = await axios.get(`${API}/${userId}`); // حاول الحصول على كارت
    return res.data; // يحتوي على cart.id
  } catch (err) {
    console.log("Cart not found, creating new one...");
    const res = await axios.post(`${API}/create/${userId}`);
    return res.data;
  }
};

// ⚡ إضافة منتج للكارت
export const addToCart = async (userId, productId, quantity = 1) => {
  try {
    const cart = await getOrCreateCart(userId); // جلب أو إنشاء الكارت أولاً
    const res = await axios.post(`${API}/${cart.id}/add/${productId}/${quantity}`);
    return res.data;
  } catch (err) {
    console.error("❌ Error adding to cart:", err);
    throw err;
  }
};

// ⚡ تحديث كمية منتج في الكارت
export const updateCartQuantity = async (cartId, productId, quantity) => {
  try {
    const res = await axios.put(`${API}/${cartId}/update/${productId}/${quantity}`);
    return res.data;
  } catch (err) {
    console.error("❌ Error updating cart quantity:", err);
    throw err;
  }
};

// ⚡ إزالة منتج من الكارت
export const removeFromCart = async (cartId, productId) => {
  try {
    const res = await axios.delete(`${API}/${cartId}/remove/${productId}`);
    return res.data;
  } catch (err) {
    console.error("❌ Error removing from cart:", err);
    throw err;
  }
};
