import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import

import { AuthContext } from "../../components/AuthContext";

const Orders = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null); // Store user role

  // Extract user ID and role from the token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id); // Assuming the token contains the user ID as `id`
        setRole(decodedToken.role); // Assuming the token contains the user's role as `role`
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

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/my-account");
    }
  }, [isLoggedIn, navigate]);

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3006/api/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        navigate("/my-account");
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId, navigate]);

  // Logout function
  const handleLogout = () => {
    logout();
    navigate("/my-account");
  };

  return (
    <div className="flex flex-col bg-white mt-5 mb-5">
      {/* Main Content */}
      <div className="flex-grow flex flex-col md:flex-row justify-between w-full md:w-5/6 mx-auto py-6 px-4">
        {/* Left Section */}
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
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                🏠 Dashboard
              </Link>
            </li>
            <li>
              <Link
                to={`/my-orders/${userId}`}
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                📦 Orders
              </Link>
            </li>
            <li>
              <Link
                to={`/addresses/${userId}`}
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                📍 Addresses
              </Link>
            </li>
            <li>
              <Link
                to={`/edit-account/${userId}`}
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                ⚙️ Account Details
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2"
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-4/5">
          <h2>My Orders</h2>
        </div>
      </div>
    </div>
  );
};

export default Orders;
