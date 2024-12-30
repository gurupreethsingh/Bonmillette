import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../components/AuthContext";

const MyOrders = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract user ID and role from the token
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

  // Fetch orders for the logged-in user
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3006/api/get-my-orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        // Handle 404 (no orders found) gracefully
        if (error.response?.status === 404) {
          setOrders([]); // No orders for the user
        } else {
          console.error("Error fetching orders:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/my-account");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col mt-5 mb-5">
      {/* Main Content */}
      <div className="flex-grow flex flex-col md:flex-row justify-between w-full md:w-5/6 mx-auto py-6 px-4">
        {/* Left Section - Navigation */}
        <div className="w-full md:w-1/5 mb-6 md:mb-0">
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
                to={`/profile/${userId}`}
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

        {/* Right Section - Orders Table */}
        <div className="w-full md:w-4/5">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>
          {orders.length > 0 ? (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="w-full border-collapse border border-gray-200 text-left">
                <thead className="bg-gray-500 text-white">
                  <tr>
                    <th className="px-4 py-2 border-b">Order ID</th>
                    <th className="px-4 py-2 border-b">Date</th>
                    <th className="px-4 py-2 border-b">Total</th>
                    <th className="px-4 py-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-100 border-b border-gray-200"
                    >
                      <td className="px-4 py-2">{order.orderId}</td>
                      <td className="px-4 py-2">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-green-600 font-bold">
                        ₹{order.total_cost.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        <Link
                          to={`/single-order-details/${order._id}`}
                          className="font-semibold text-red-800 hover:text-gray-800"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 bg-white shadow-md p-6 rounded-lg">
              You have no orders yet. Start shopping to place your first order!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
