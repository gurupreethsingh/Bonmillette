import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

import { AuthContext } from "../../components/AuthContext";
import {
  FiHome,
  FiBox,
  FiMapPin,
  FiUser,
  FiLogOut,
  FiSearch,
} from "react-icons/fi";

const Addresses = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [id, setId] = useState(null);
  const [role, setRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Extract user ID and role from the token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setId(decodedToken.id);
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
          `http://localhost:3006/api/user/${id}`,
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

    if (id) {
      fetchUserDetails();
    }
  }, [id, navigate]);

  // Delete a shipping address
  const deleteShippingAddress = async (index) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:3006/api/user/${id}/shipping-address/${index}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success("Shipping address deleted successfully!");

        // Update the state after successful deletion
        setUserData((prevData) => ({
          ...prevData,
          shipping_addresses: prevData.shipping_addresses.filter(
            (_, i) => i !== index
          ),
        }));
      } catch (error) {
        console.error("Error deleting shipping address:", error);
        toast.error("Failed to delete shipping address. Please try again.");
      }
    }
  };

  const formatAddress = (address) => {
    if (!address) {
      return "No address provided.";
    }
    const { street, city, state, postalCode, country } = address;
    return `${street || "N/A"}, ${city || "N/A"}, ${state || "N/A"}, ${
      postalCode || "N/A"
    }, ${country || "N/A"}`;
  };

  const filteredAddresses = (keyword) => {
    const lowerKeyword = keyword.toLowerCase();
    const shippingAddresses = userData?.shipping_addresses || [];
    return shippingAddresses.filter((address) =>
      formatAddress(address).toLowerCase().includes(lowerKeyword)
    );
  };

  const addressesToRender = filteredAddresses(searchTerm);

  return (
    <div className="flex flex-col bg-white mt-5 mb-5">
      <div className="flex-grow flex flex-col md:flex-row w-full md:w-5/6 mx-auto py-6 px-4 gap-6">
        {/* Left Navigation */}
        <div className="w-full md:w-1/5 p-4 bg-gray-50 shadow-md rounded-lg">
          <ul className="space-y-4">
            <li>
              <Link
                to={`/${
                  role === "superadmin"
                    ? "superadmin-dashboard"
                    : "user-dashboard"
                }/${id}`}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
              >
                <FiHome size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/my-orders/${id}`}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
              >
                <FiBox size={20} />
                <span>Orders</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/addresses/${id}`}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
              >
                <FiMapPin size={20} />
                <span>Addresses</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/profile/${id}`}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
              >
                <FiUser size={20} />
                <span>Account Details</span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => logout()}
                className="flex items-center gap-4 p-3 rounded-lg text-red-500 hover:text-red-700 hover:underline"
              >
                <FiLogOut size={20} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-4/5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold text-gray-800">
              Manage Addresses
            </h2>
            <div className="relative w-1/2 md:w-1/3">
              <input
                type="text"
                placeholder="Search addresses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-full shadow focus:outline-none focus:ring focus:ring-blue-300"
              />
              <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400">
                <FiSearch size={20} />
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Billing Address */}
            <div className="p-5 shadow bg-gray-100 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Billing Address
              </h3>
              <p className="text-gray-600 font-semibold mb-2">
                Name: {userData?.name || "N/A"}
              </p>
              <p className="text-gray-600 font-semibold mb-4">
                Email: {userData?.email || "N/A"}
              </p>
              <p className="text-gray-600">
                {userData?.address
                  ? formatAddress(userData.address)
                  : "No billing address provided."}
              </p>
              <button
                className="mt-4 px-6 py-1 bg-red-500 hover:bg-red-700 text-white rounded-pill font-semibold"
                onClick={() => navigate(`/profile/${id}`)}
              >
                Edit Billing Address
              </button>
            </div>

            {/* Shipping Addresses */}
            <div className="p-5 shadow bg-gray-100 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Shipping Addresses
              </h3>
              {addressesToRender.length > 0 ? (
                addressesToRender.map((address, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-gray-600">{formatAddress(address)}</p>
                    <button
                      className="mt-2 bg-red-500 text-white font-semibold hover:bg-red-700 py-1 px-4 rounded-pill"
                      onClick={() => deleteShippingAddress(index)}
                    >
                      Delete Address
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No shipping addresses provided.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addresses;
