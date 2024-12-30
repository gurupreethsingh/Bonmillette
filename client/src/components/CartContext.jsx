import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart from localStorage or server
    const token = localStorage.getItem("token");
    if (token) {
      // Fetch cart items from the server
      fetchCartFromServer(token);
    } else {
      // Load cart from localStorage
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(localCart);
    }
  }, []);

  const fetchCartFromServer = async (token) => {
    try {
      const response = await axios.get("http://localhost:3006/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items from server:", error);
    }
  };

  const addToCart = (productId, priceAtPurchase, quantity = 1) => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Update localStorage cart
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItemIndex = localCart.findIndex(
        (item) => item.productId === productId
      );

      if (existingItemIndex > -1) {
        localCart[existingItemIndex].quantity += quantity;
      } else {
        localCart.push({ productId, priceAtPurchase, quantity });
      }
      localStorage.setItem("cart", JSON.stringify(localCart));
      setCartItems(localCart);
      return;
    }

    // Add to server cart if logged in
    axios
      .post(
        "http://localhost:3006/api/cart",
        { productId, priceAtPurchase, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => fetchCartFromServer(token))
      .catch((error) => console.error("Error adding to cart:", error));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
