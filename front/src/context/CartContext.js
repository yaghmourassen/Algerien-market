import { createContext, useState } from "react";

// 1. create context
export const CartContext = createContext();

// 2. provider (wraps your whole app)
export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
}