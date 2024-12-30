import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Ensure this is properly installed
import { AuthContext } from "../../components/AuthContext";

const AddIssue = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [id, setId] = useState(null); // Logged-in user's ID
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]); // Store fetched orders
  const [selectedOrderId, setSelectedOrderId] = useState("");

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
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
        setError("Failed to fetch orders. Please try again.");
      }
    };

    fetchOrders();
  }, []);

  // Fetch logged-in user's ID from the token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setId(decodedToken.id); // Set logged-in user's ID
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError("You can upload a maximum of 5 images.");
      return;
    }
    setImages(files);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      setError("User ID is not available. Please log in again.");
      return;
    }

    if (!selectedOrderId) {
      setError("Order ID is required to raise an issue.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized. Please log in.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("order_id", selectedOrderId); // Use selectedOrderId here
      formData.append("customer_id", id); // Add logged-in user's ID
      images.forEach((image) => {
        formData.append("issue_images", image);
      });

      await axios.post("http://localhost:3006/api/add-issue", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Issue added successfully!");
      navigate("/all-issues");
    } catch (err) {
      console.error("Error adding issue:", err);
      setError(err.response?.data?.message || "Failed to add issue.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/my-account");
  };

  return (
    <div className="flex flex-col mt-5 mb-5">
      <div className="flex-grow flex flex-col md:flex-row justify-between w-full md:w-5/6 mx-auto py-6 px-4 gap-6">
        {/* Navigation Section */}
        <div className="w-full md:w-1/5 mb-6 md:mb-0 first-line:p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Navigation
          </h3>
          <ul className="space-y-4">
            <li>
              <Link
                to={`/user-dashboard/${id}`}
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50"
              >
                🏠 Dashboard
              </Link>
            </li>
            <li>
              <Link
                to={`/my-orders/${id}`}
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50"
              >
                📦 Orders
              </Link>
            </li>
            <li>
              <Link
                to={`/all-issues`}
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50"
              >
                🛠️ Issues
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2 p-2 rounded-lg hover:bg-red-50"
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Add Issue Form */}
        <div className="w-full md:w-4/5 rounded-lg p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Report an Issue
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-red-500 bg-red-100 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter issue title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Order ID
              </label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                required
              >
                <option value="" disabled>
                  Select your order-ID
                </option>
                {orders.map((order) => (
                  <option key={order._id} value={order._id}>
                    {order.orderId}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe the issue"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                rows="4"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Upload Images (Max 5)
              </label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 z-50 cursor-pointer"
                />
                <div className="flex items-center justify-center w-full h-12 border rounded-lg bg-blue-50 font-semibold hover:bg-blue-100 cursor-pointer">
                  Upload Files
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="bg-red-600 text-white font-bold py-2 px-6 rounded-full hover:bg-red-800 w-full md:w-auto"
            >
              Submit Issue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddIssue;
