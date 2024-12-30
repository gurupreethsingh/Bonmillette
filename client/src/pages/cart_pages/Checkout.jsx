import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = () => {
  const location = useLocation();
  const {
    user,
    billingAddress: passedBillingAddress,
    shippingAddress: passedShippingAddress,
    cartItems: passedCartItems,
    totalPrice: passedTotalPrice,
  } = location.state || {};

  const [billingAddress, setBillingAddress] = useState(
    passedBillingAddress || {}
  );
  const [shippingAddress, setShippingAddress] = useState(
    passedShippingAddress || {}
  );
  const [cartItems, setCartItems] = useState(passedCartItems || []);
  const [totalPrice, setTotalPrice] = useState(passedTotalPrice || 0);
  const [isCashOnDelivery, setIsCashOnDelivery] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!location.state || !user || !billingAddress || !cartItems.length) {
      toast.error("Some data is missing. Please go back to the cart page.");
    }
  }, []); // Run only on component mount

  const handleConfirmOrder = async () => {
    if (isProcessing) return; // Prevent multiple clicks
    if (!isCashOnDelivery) {
      toast.error("Please select the Cash on Delivery option.");
      return;
    }

    if (cartItems.length === 0 || totalPrice === 0) {
      toast.error("No items in the cart to confirm.");
      return;
    }

    setIsProcessing(true); // Disable button to prevent duplicate requests

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("User not logged in.");
        setIsProcessing(false);
        return;
      }

      // Create Order
      const orderDetails = {
        orderId: `ORD-${Date.now()}`,
        products: cartItems.map((item) => ({
          product: item.product._id,
          product_name: item.product.product_name,
          quantity: item.quantity,
          price_per_unit: item.priceAtPurchase,
          total_price: item.priceAtPurchase * item.quantity,
        })),
        billing_address: billingAddress,
        shipping_address: shippingAddress,
        payment_method: "Cash on Delivery",
        subtotal: totalPrice,
        total_cost: totalPrice,
      };

      const orderResponse = await axios.post(
        "http://localhost:3006/api/create-order",
        orderDetails,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!orderResponse.data.success) {
        toast.error("Failed to confirm your order. Please try again.");
        setIsProcessing(false);
        return;
      }

      // Clear Cart
      const clearCartResponse = await axios.delete(
        "http://localhost:3006/api/cart",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (clearCartResponse.status === 200) {
        // Reset all states
        setCartItems([]);
        setTotalPrice(0);
        setBillingAddress({});
        setShippingAddress({});
        setIsCashOnDelivery(false);

        toast.success("Your order is confirmed!");

        // Reload the page after the toast
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Adjust delay as needed
      } else {
        toast.error("Failed to clear the cart.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error confirming order:", error.message);
      toast.error("Failed to confirm your order.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="mb-4">
        <h2 className="text-lg font-bold">User Information</h2>
        <p>
          <strong>Name:</strong> {user?.name || "Not provided"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email || "Not provided"}
        </p>
        <p>
          <strong>Phone:</strong> {user?.phone || "Not provided"}
        </p>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-bold">Billing Address</h2>
        <p>
          {billingAddress.street}, {billingAddress.city}, {billingAddress.state}
          , {billingAddress.postalCode}, {billingAddress.country}
        </p>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-bold">Shipping Address</h2>
        <p>
          {shippingAddress.street}, {shippingAddress.city},{" "}
          {shippingAddress.state}, {shippingAddress.postalCode},{" "}
          {shippingAddress.country}
        </p>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-bold">Your Order</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Product Name</th>
              <th className="border px-2 py-1">Quantity</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item._id}>
                <td className="border px-2 py-1">
                  {item.product.product_name}
                </td>
                <td className="border px-2 py-1">{item.quantity}</td>
                <td className="border px-2 py-1">₹{item.priceAtPurchase}</td>
                <td className="border px-2 py-1">
                  ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="font-bold mt-4">Total: ₹{totalPrice.toFixed(2)}</p>
      </div>
      <div className="mb-4">
        <label>
          <input
            type="checkbox"
            checked={isCashOnDelivery}
            onChange={(e) => setIsCashOnDelivery(e.target.checked)}
          />
          <span className="ml-2">Cash on Delivery</span>
        </label>
      </div>
      <button
        onClick={handleConfirmOrder}
        className={`px-4 py-2 text-white rounded ${
          isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"
        }`}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Confirm Order"}
      </button>
    </div>
  );
};

export default Checkout;
