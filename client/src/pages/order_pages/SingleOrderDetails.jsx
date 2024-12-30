import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../components/AuthContext";
import {
  AiOutlineDashboard,
  AiOutlineShoppingCart,
  AiOutlineLogout,
} from "react-icons/ai";
import { FiMapPin } from "react-icons/fi";
import { MdAccountCircle } from "react-icons/md";

const SingleOrderDetails = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
        setRole(decodedToken.role);
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
        navigate("/my-account");
      }
    } else {
      logout();
      navigate("/my-account");
    }
  }, [logout, navigate]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. User might be logged out.");
        }

        const response = await axios.get(
          `http://localhost:3006/api/get-order-details-by-orderid/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrderDetails(response.data.order);
      } catch (error) {
        console.error("Error fetching order details:", error.message);
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [logout, id]);

  const handleLogout = () => {
    logout();
    navigate("/my-account");
  };

  const formatAddress = (address) =>
    address
      ? `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`
      : "Not provided";

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!orderDetails) {
    return <div className="text-center mt-10">Order details not found.</div>;
  }

  return (
    <div className="flex flex-col mt-5 mb-5">
      <div className="flex-grow flex flex-col md:flex-row justify-between w-full md:w-5/6 mx-auto py-6 px-4 gap-6">
        {/* Left Section - Navigation */}{" "}
        <div className="w-full md:w-1/5 mb-6 md:mb-0 bg-white rounded-lg ">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Navigation
          </h3>
          <ul className="space-y-4">
            <li>
              <Link
                to={`/${
                  role === "superadmin"
                    ? "superadmin-dashboard"
                    : "user-dashboard"
                }/${userId}`}
                className="text-gray-600 hover:text-red-800 font-medium flex items-center gap-2 p-2"
              >
                🏠 Dashboard
              </Link>
            </li>
            <li>
              <Link
                to={`/my-orders/${userId}`}
                className="text-gray-600 hover:text-red-800 font-medium flex items-center gap-2 p-2"
              >
                📦 Orders
              </Link>
            </li>
            <li>
              <Link
                to={`/addresses/${userId}`}
                className="text-gray-600 hover:text-red-800 font-medium flex items-center gap-2 p-2"
              >
                📍 Addresses
              </Link>
            </li>
            <li>
              <Link
                to={`/edit-account/${userId}`}
                className="text-gray-600 hover:text-red-800 font-medium flex items-center gap-2 p-2"
              >
                ⚙️ Account Details
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-800 font-medium flex items-center gap-2"
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        </div>
        {/* Right Section - Order Details */}
        <div className="w-full md:w-3/4 bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Order Details
          </h1>

          {/* User Details */}
          {orderDetails.user && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">User Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p>
                  <strong>Name:</strong> {orderDetails.user.name}
                </p>
                <p>
                  <strong>Email:</strong> {orderDetails.user.email}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {orderDetails.user.phone || "Not provided"}
                </p>
                <p>
                  <strong>Billing Address:</strong>{" "}
                  {formatAddress(orderDetails.billing_address)}
                </p>
                <p>
                  <strong>Shipping Address:</strong>{" "}
                  {formatAddress(orderDetails.shipping_address)}
                </p>
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Order Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p>
                <strong>Order ID:</strong> {orderDetails.orderId}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Total Cost:</strong> ₹
                {orderDetails.total_cost.toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong> {orderDetails.status || "Pending"}
              </p>
            </div>
          </div>

          {/* Product Details */}
          {/* Product Details */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Products</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2">Product Name</th>
                    <th className="border px-4 py-2">Price</th>
                    <th className="border px-4 py-2">Quantity</th>
                    <th className="border px-4 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.products.map((product, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">
                        {product.product_name || "Unnamed Product"}
                      </td>
                      <td className="border px-4 py-2">
                        ₹{(product.price_per_unit || 0).toFixed(2)}
                      </td>
                      <td className="border px-4 py-2">
                        {product.quantity || 0}
                      </td>
                      <td className="border px-4 py-2">
                        ₹{(product.total_price || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOrderDetails;
