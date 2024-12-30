import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaEdit } from "react-icons/fa";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch cart items
        const cartResponse = await axios.get("http://localhost:3006/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(cartResponse.data.items);
        calculateTotalPrice(cartResponse.data.items);

        // Fetch user details
        const userResponse = await axios.get("http://localhost:3006/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = userResponse.data;
        setUserDetails(user);

        // Set billing address
        if (
          user.address &&
          user.address.street &&
          user.address.city &&
          user.address.state
        ) {
          setBillingAddress(user.address);
        } else {
          setBillingAddress(null); // Explicitly set null for incomplete address
        }

        // Set shipping addresses and default selection
        const userShippingAddresses = user.shipping_addresses || [];
        setShippingAddresses(userShippingAddresses);
        setSelectedShippingAddress(user.address); // Default to billing address
      } catch (error) {
        console.error("Error fetching cart or user details:", error.message);
      }
    };

    fetchCartData();
  }, []);

  const calculateTotalPrice = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.priceAtPurchase * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;

    const updatedItems = cartItems.map((item) =>
      item.product._id === productId ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);
    calculateTotalPrice(updatedItems);
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete("http://localhost:3006/api/cart/item", {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId },
      });

      toast.success("Product removed from cart!");
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.product._id !== productId)
      );
    } catch (error) {
      toast.error("Failed to remove product.");
    }
  };

  const handleAddNewAddress = async () => {
    try {
      const token = localStorage.getItem("token");

      // Validate if all fields are filled
      if (
        !newAddress.street ||
        !newAddress.city ||
        !newAddress.state ||
        !newAddress.postalCode ||
        !newAddress.country
      ) {
        toast.error("Please fill all fields before adding a new address.");
        return;
      }

      // Add new address via API
      const response = await axios.put(
        `http://localhost:3006/api/update-shipping-address/${userDetails._id}`,
        { shipping_address: newAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state with new address
      setShippingAddresses((prevAddresses) => [
        ...prevAddresses,
        response.data.user.shipping_addresses.at(-1),
      ]);
      setSelectedShippingAddress(response.data.user.shipping_addresses.at(-1));
      setNewAddress({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      });
      toast.success("New address added successfully!");
    } catch (error) {
      console.error("Error adding new address:", error.message);
      setNewAddress({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      });
      toast.error("Failed to add new address. Please try again.");
    }
  };

  const handleRemoveAddress = async (index) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete("http://localhost:3006/api/user/shipping-address", {
        headers: { Authorization: `Bearer ${token}` },
        data: { index },
      });

      setShippingAddresses((prevAddresses) =>
        prevAddresses.filter((_, i) => i !== index)
      );
      toast.success("Shipping address deleted successfully!");
    } catch (error) {
      console.error("Error deleting shipping address:", error.message);
      toast.error("Failed to delete shipping address.");
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a valid coupon code.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3006/api/coupons/apply-coupon",
        {
          code: couponCode,
          cartValue: totalPrice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { discount, message } = response.data;
      setTotalPrice((prevTotal) => prevTotal - discount);
      toast.success(`${message}: You saved ₹${discount}!`);
      setCouponCode("");
    } catch (error) {
      console.error(
        "Error applying coupon:",
        error.response?.data?.message || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Failed to apply coupon. Please try again."
      );
    }
  };

  const handleProceedToCheckout = () => {
    if (!selectedShippingAddress) {
      toast.error("Please select a shipping address to proceed.");
      return;
    }

    navigate(`/checkout/${userDetails._id}`, {
      state: {
        user: {
          name: userDetails.name,
          email: userDetails.email,
          phone: userDetails.phone || "Not provided",
        },
        billingAddress,
        shippingAddress: selectedShippingAddress,
        cartItems,
        totalPrice,
      },
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-red-600">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Address List */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-600 underline">
              Customer Information
            </h3>
            {userDetails.name && userDetails.email ? (
              <div>
                <p>
                  <strong>Name:</strong> {userDetails.name}
                </p>
                <p>
                  <strong>Email:</strong> {userDetails.email}
                </p>
                <p>
                  <strong>Phone:</strong> {userDetails.phone || "Not provided"}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">
                User information is not available.
              </p>
            )}
          </div>

          {/* Billing Address */}
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-600 underline">
              Billing Address
            </h3>
            {billingAddress ? (
              <p>{`${billingAddress.street}, ${billingAddress.city}, ${billingAddress.state}`}</p>
            ) : (
              <p className="text-gray-500">Billing address not provided.</p>
            )}
          </div>

          {/* Shipping Address Selection */}
          <div className="mb-6">
            <h3 className="text-base underline font-bold text-gray-700 mb-2">
              Shipping Address
            </h3>
            <label>
              <input
                type="radio"
                checked={selectedShippingAddress === billingAddress}
                onChange={() => setSelectedShippingAddress(billingAddress)}
                className="mt-3 mb-3"
              />
              <span> Use Billing Address as Shipping Address</span>
            </label>
            {shippingAddresses.map((address, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-4"
              >
                <label>
                  <input
                    type="radio"
                    checked={selectedShippingAddress === address}
                    onChange={() => setSelectedShippingAddress(address)}
                    className="mr-2"
                  />
                  {`${address.street}, ${address.city}, ${address.state}`}
                </label>
                <div className="flex items-center space-x-2">
                  <FaEdit className="text-green-500 cursor-pointer" />
                  <FaTrash
                    className="text-red-600 cursor-pointer"
                    onClick={() => handleRemoveAddress(index)}
                  />
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-bold mt-6 mb-2 underline text-gray-600">
            Add New Shipping Address
          </h3>
          {["street", "city", "state", "postalCode", "country"].map((field) => (
            <input
              key={field}
              name={field}
              value={newAddress[field]}
              onChange={(e) =>
                setNewAddress((prev) => ({ ...prev, [field]: e.target.value }))
              }
              placeholder={`Enter ${field}`}
              className="w-full mb-2 p-2 border rounded"
            />
          ))}
          <div className="text-center">
            <button
              onClick={handleAddNewAddress}
              className="btn btn-sm bg-red-600 rounded-pill text-white font-bold hover:bg-red-700 px-4 py-2 mt-3"
            >
              Add New Shipping Address
            </button>
          </div>
        </div>

        {/* Cart Items and Totals */}
        <div>
          {/* Product Section */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-bold mb-4 text-red-600">
              Your Cart Items
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 text-left bg-white shadow-md rounded-lg">
                <thead>
                  <tr>
                    <th className="p-4 border-b border-gray-200">Product</th>
                    <th className="p-4 border-b border-gray-200">Price</th>
                    <th className="p-4 border-b border-gray-200">Quantity</th>
                    <th className="p-4 border-b border-gray-200">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="p-4 flex items-center space-x-4">
                        <img
                          src={`http://localhost:3006/${item.product.product_image}`}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span>{item.product.name}</span>
                      </td>
                      <td className="p-4">₹{item.priceAtPurchase}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            className="px-2 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                            className="px-2 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        ₹{item.priceAtPurchase * item.quantity}
                      </td>
                      <td className="p-4">
                        <FaTrash
                          onClick={() => handleRemoveItem(item.product._id)}
                          className="text-red-500 hover:text-red-600 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <h2 className="text-lg font-bold text-red-600 mb-4">
              Apply Coupon
            </h2>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 border border-gray-300 rounded px-4 py-2"
              />
              <button
                onClick={applyCoupon}
                className="btn bg-red-700 text-white font-bold rounded-pill"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Cart Totals */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-red-600">Cart Totals</h2>
            <div className="flex justify-between items-center border-b border-gray-200 py-2">
              <p>Subtotal</p>
              <p>₹{totalPrice}</p>
            </div>
            <div className="text-center">
              <button
                onClick={handleProceedToCheckout}
                className=" mt-4 px-6 py-2 text-lg font-semibold bg-red-600 text-white rounded-pill shadow hover:bg-red-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
